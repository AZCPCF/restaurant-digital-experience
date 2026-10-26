import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';

import slug from 'slug';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module.js';
import { DatabaseExceptionFilter } from '../src/common/exceptions/database-exception.filter.js';
import { MenuEntity } from '../src/modules/menus/entities/menu.entity.js';
import { RestaurantEntity } from '../src/modules/restaurants/entities/restaurant.entity.js';

const createMenuDto = (name = 'TEST MENU') => ({
  name,
  slug: slug(name),
});

const createRestaurantDto = (name = 'TEST RESTAURANT') => ({
  name,
  slug: slug(name),
});

describe('Menus (e2e)', () => {
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

    await dataSource.getRepository(MenuEntity).deleteAll();
    await dataSource.getRepository(RestaurantEntity).deleteAll();

    await app.close();
  });

  describe('GET /menus', () => {
    it('should return menus', async () => {
      const response = await request(app.getHttpServer())
        .get('/menus')
        .expect(200);

      expect(response.body).toBeDefined();
    });
    it('should return menus when menus exist', async () => {
      const dataSource = app.get(DataSource);
      const restaurant = await dataSource
        .getRepository(RestaurantEntity)
        .save(createRestaurantDto());

      const menus = await dataSource.getRepository(MenuEntity).save({
        ...createMenuDto('Garden Menu'),
        restaurantId: restaurant.id,
      });
      const response = await request(app.getHttpServer())
        .get('/menus')
        .expect(200);
      console.log(response.body.data);

      expect(response.body.data[0].name).toEqual(menus.name);
    });
    it('should filter menus by name with eq operator', async () => {
      const dataSource = app.get(DataSource);
      const restaurant = await dataSource
        .getRepository(RestaurantEntity)
        .save(createRestaurantDto());
      await dataSource
        .getRepository(MenuEntity)
        .save([
          { ...createMenuDto('Garden Menu'), restaurantId: restaurant.id },
          { ...createMenuDto('Test Menu'), restaurantId: restaurant.id },
        ]);
      const response = await request(app.getHttpServer())
        .get('/menus?filter[name][eq]=Garden%20Menu')
        .expect(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Garden Menu');
    });
    it('should filter restaurants by name with like operator', async () => {
      const dataSource = app.get(DataSource);
      await dataSource
        .getRepository(RestaurantEntity)
        .save([
          createMenuDto('Garden Restaurant'),
          createMenuDto('Beautiful Garden Cafe'),
          createMenuDto('Test Restaurant'),
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
          ...createMenuDto('Old Restaurant'),
          created_at: new Date('2026-08-01T00:00:00.000Z'),
        },
        {
          ...createMenuDto('September Restaurant'),
          created_at: new Date('2026-09-03T00:00:00.000Z'),
        },
        {
          ...createMenuDto('New Restaurant'),
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
          createMenuDto('Garden Restaurant'),
          createMenuDto('Garden Cafe'),
          createMenuDto('Test Restaurant'),
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
          createMenuDto('Restaurant One'),
          createMenuDto('Restaurant Two'),
          createMenuDto('Restaurant Three'),
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
          ...createMenuDto('Garden Alpha'),
          created_at: new Date('2026-09-01T00:00:00.000Z'),
        },
        {
          ...createMenuDto('Garden Beta'),
          created_at: new Date('2026-09-02T00:00:00.000Z'),
        },
        {
          ...createMenuDto('Garden Gamma'),
          created_at: new Date('2026-09-03T00:00:00.000Z'),
        },
        {
          ...createMenuDto('Test Restaurant'),
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

  describe('GET /restaurants/:id', () => {
    it('should return a restaurant by id', async () => {
      const dataSource = app.get(DataSource);

      const restaurant = await dataSource
        .getRepository(RestaurantEntity)
        .save(createMenuDto());

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
        .save(createMenuDto());

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
        .save(createMenuDto());

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
        .save(createMenuDto());

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
