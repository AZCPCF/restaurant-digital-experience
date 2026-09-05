import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';

import { AppModule } from './../src/app.module.js';
import { DataSource } from 'typeorm';
import { RestaurantEntity } from '../src/modules/restaurants/entities/restaurant.entity.js';
import slug from 'slug';
import { DatabaseExceptionFilter } from '../src/common/exceptions/database-exception.filter.js';

const createRestaurantDto = (name = 'TEST RESTAURANT') => ({
  name,
  slug: slug(name),
});

describe('Restaurants (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.getHttpAdapter().getInstance().set('query parser', 'extended');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.useGlobalFilters(new DatabaseExceptionFilter());

    await app.init();
  });

  afterEach(async () => {
    const dataSource = app.get(DataSource);

    await dataSource.getRepository(RestaurantEntity).clear();

    await app.close();
  });

  describe('GET /restaurants', () => {
    it('should return restaurants', async () => {
      const response = await request(app.getHttpServer())
        .get('/restaurants')
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('should return restaurants when restaurants exist', async () => {
      const dataSource = app.get(DataSource);

      const restaurant = await dataSource
        .getRepository(RestaurantEntity)
        .save(createRestaurantDto());

      const response = await request(app.getHttpServer())
        .get('/restaurants')
        .expect(200);

      expect(response.body.data[0].name).toEqual(restaurant.name);
    });
  });

  describe('GET /restaurants/:id', () => {
    it('should return a restaurant by id', async () => {
      const dataSource = app.get(DataSource);

      const restaurant = await dataSource
        .getRepository(RestaurantEntity)
        .save(createRestaurantDto());

      const response = await request(app.getHttpServer())
        .get(`/restaurants/${restaurant.id}`)
        .expect(200);

      expect(response.body.name).toEqual(restaurant.name);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .get('/restaurants/NOT_UUID')
        .expect(400);
    });

    it('should return 404 when restaurant does not exist', async () => {
      await request(app.getHttpServer())
        .get(`/restaurants/${crypto.randomUUID()}`)
        .expect(404);
    });
    it('should filter restaurants by name with eq operator', async () => {
      const dataSource = app.get(DataSource);
      await dataSource
        .getRepository(RestaurantEntity)
        .save([
          createRestaurantDto('Garden Restaurant'),
          createRestaurantDto('Test Restaurant'),
        ]);
      const response = await request(app.getHttpServer())
        .get('/restaurants?filter[name][eq]=Garden%20Restaurant')
        .expect(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Garden Restaurant');
    });
    it('should filter restaurants by name with like operator', async () => {
      const dataSource = app.get(DataSource);
      await dataSource
        .getRepository(RestaurantEntity)
        .save([
          createRestaurantDto('Garden Restaurant'),
          createRestaurantDto('Beautiful Garden Cafe'),
          createRestaurantDto('Test Restaurant'),
        ]);
      const response = await request(app.getHttpServer())
        .get('/restaurants?filter[name][like]=Garden')
        .expect(200);
      expect(response.body.data).toHaveLength(2);
      expect(
        response.body.data.every((restaurant: RestaurantEntity) =>
          restaurant.name.includes('Garden'),
        ),
      ).toBe(true);
    });
    it('should filter restaurants by created_at range', async () => {
      const dataSource = app.get(DataSource);
      const repository = dataSource.getRepository(RestaurantEntity);
      await repository.save([
        {
          ...createRestaurantDto('Old Restaurant'),
          created_at: new Date('2026-08-01T00:00:00.000Z'),
        },
        {
          ...createRestaurantDto('September Restaurant'),
          created_at: new Date('2026-09-03T00:00:00.000Z'),
        },
        {
          ...createRestaurantDto('New Restaurant'),
          created_at: new Date('2026-09-10T00:00:00.000Z'),
        },
      ]);
      const response = await request(app.getHttpServer())
        .get(
          '/restaurants?filter[created_at][gte]=2026-09-01&filter[created_at][lte]=2026-09-05',
        )
        .expect(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('September Restaurant');
    });
    it('should filter restaurants by multiple fields', async () => {
      const dataSource = app.get(DataSource);
      await dataSource
        .getRepository(RestaurantEntity)
        .save([
          createRestaurantDto('Garden Restaurant'),
          createRestaurantDto('Garden Cafe'),
          createRestaurantDto('Test Restaurant'),
        ]);
      const gardenRestaurant = await dataSource
        .getRepository(RestaurantEntity)
        .findOneBy({ name: 'Garden Restaurant' });
      expect(gardenRestaurant).not.toBeNull();
      const response = await request(app.getHttpServer())
        .get(
          `/restaurants?filter[name][like]=Garden&filter[id][eq]=${gardenRestaurant!.id}`,
        )
        .expect(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Garden Restaurant');
    });
    it('should filter restaurants by id with in operator', async () => {
      const dataSource = app.get(DataSource);
      const restaurants = await dataSource
        .getRepository(RestaurantEntity)
        .save([
          createRestaurantDto('Restaurant One'),
          createRestaurantDto('Restaurant Two'),
          createRestaurantDto('Restaurant Three'),
        ]);
      const ids = [restaurants[0].id, restaurants[2].id].join(',');
      const response = await request(app.getHttpServer())
        .get(`/restaurants?filter[id][in]=${ids}`)
        .expect(200);
      expect(response.body.data).toHaveLength(2);
      expect(
        response.body.data.map((restaurant: RestaurantEntity) => restaurant.id),
      ).toEqual(expect.arrayContaining([restaurants[0].id, restaurants[2].id]));
    });
    it('should combine filter, sorting and pagination', async () => {
      const dataSource = app.get(DataSource);
      const repository = dataSource.getRepository(RestaurantEntity);
      await repository.save([
        {
          ...createRestaurantDto('Garden Alpha'),
          created_at: new Date('2026-09-01T00:00:00.000Z'),
        },
        {
          ...createRestaurantDto('Garden Beta'),
          created_at: new Date('2026-09-02T00:00:00.000Z'),
        },
        {
          ...createRestaurantDto('Garden Gamma'),
          created_at: new Date('2026-09-03T00:00:00.000Z'),
        },
        {
          ...createRestaurantDto('Test Restaurant'),
          created_at: new Date('2026-09-04T00:00:00.000Z'),
        },
      ]);
      const response = await request(app.getHttpServer())
        .get(
          '/restaurants?page=1&limit=2&sort=created_at:DESC&filter[name][like]=Garden',
        )
        .expect(200);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(2);
      expect(response.body.total).toBe(3);
      expect(response.body.pages).toBe(2);
      expect(response.body.hasNext).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBe('Garden Gamma');
      expect(response.body.data[1].name).toBe('Garden Beta');
    });
  });

  describe('POST /restaurants', () => {
    it('should create a restaurant', async () => {
      const response = await request(app.getHttpServer())
        .post('/restaurants')
        .send({
          name: 'Test Restaurant',
        })
        .expect(201);

      expect(response.body).toBeDefined();
    });

    it('should return 400 when name is missing', async () => {
      await request(app.getHttpServer())
        .post('/restaurants')
        .send()
        .expect(400);
    });

    it('should return 400 when name is too short', async () => {
      await request(app.getHttpServer())
        .post('/restaurants')
        .send({
          name: 'abc',
        })
        .expect(400);
    });

    it('should return 409 when slug already exists', async () => {
      await request(app.getHttpServer())
        .post('/restaurants')
        .send({
          name: 'Test Restaurant',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/restaurants')
        .send({
          name: 'Test Restaurant',
        })
        .expect(409);

      expect(response.body).toBeDefined();
    });
  });

  describe('PATCH /restaurants/:id', () => {
    it('should update restaurant name and slug', async () => {
      const name = 'NEW NAME';

      const dataSource = app.get(DataSource);

      const restaurant = await dataSource
        .getRepository(RestaurantEntity)
        .save(createRestaurantDto());

      const response = await request(app.getHttpServer())
        .patch(`/restaurants/${restaurant.id}`)
        .send({
          name,
        })
        .expect(200);

      expect(response.body.name).toEqual(name);

      expect(response.body.slug).toEqual(slug(name));
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .patch('/restaurants/NOT_UUID')
        .send({
          name: 'NAME',
        })
        .expect(400);
    });

    it('should return 400 when name is too short', async () => {
      const dataSource = app.get(DataSource);

      const restaurant = await dataSource
        .getRepository(RestaurantEntity)
        .save(createRestaurantDto());

      await request(app.getHttpServer())
        .patch(`/restaurants/${restaurant.id}`)
        .send({
          name: 'NEW',
        })
        .expect(400);
    });

    it('should return 404 when restaurant does not exist', async () => {
      await request(app.getHttpServer())
        .patch(`/restaurants/${crypto.randomUUID()}`)
        .send({
          name: 'NEW NAME',
        })
        .expect(404);
    });
  });

  describe('DELETE /restaurants/:id', () => {
    it('should delete restaurant', async () => {
      const dataSource = app.get(DataSource);

      const restaurant = await dataSource
        .getRepository(RestaurantEntity)
        .save(createRestaurantDto());

      await request(app.getHttpServer())
        .delete(`/restaurants/${restaurant.id}`)
        .expect(200);

      const deletedRestaurant = await dataSource
        .getRepository(RestaurantEntity)
        .findOneBy({
          id: restaurant.id,
        });

      expect(deletedRestaurant).toBeNull();
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .delete('/restaurants/NOT_UUID')
        .expect(400);
    });

    it('should return 404 when restaurant does not exist', async () => {
      await request(app.getHttpServer())
        .delete(`/restaurants/${crypto.randomUUID()}`)
        .expect(404);
    });
  });
});
