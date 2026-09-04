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
