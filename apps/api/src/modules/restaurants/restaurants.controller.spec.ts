import { Test, TestingModule } from '@nestjs/testing';
import { Mock } from 'vitest';

import { RestaurantsController } from './restaurants.controller.js';
import { RestaurantsService } from './restaurants.service.js';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;

  let restaurantsServiceMock: {
    create: Mock;
    findAll: Mock;
    findOne: Mock;
    update: Mock;
    remove: Mock;
  };

  beforeEach(async () => {
    restaurantsServiceMock = {
      create: vitest.fn(),
      findAll: vitest.fn(),
      findOne: vitest.fn(),
      update: vitest.fn(),
      remove: vitest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: restaurantsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a restaurant', async () => {
      const dto = {
        name: 'Test Restaurant',
        slug: 'Test Restaurant Slug',
      };

      restaurantsServiceMock.create.mockResolvedValue(dto);

      const result = await controller.create(dto);

      expect(restaurantsServiceMock.create).toHaveBeenCalledExactlyOnceWith(
        dto,
      );

      expect(result).toEqual(dto);
    });
  });

  describe('findAll', () => {
    it('should return all restaurants', async () => {
      const data = {
        data: [],
        page: 1,
        limit: 20,
        pages: 0,
        total: 0,
        hasNext: false,
      };

      restaurantsServiceMock.findAll.mockResolvedValue(data);

      const result = await controller.findAll();

      expect(restaurantsServiceMock.findAll).toHaveBeenCalledExactlyOnceWith();

      expect(result).toEqual(data);
    });
  });

  describe('findOne', () => {
    it('should return a restaurant by id', async () => {
      const data = {
        id: 'test',
        name: 'Test Restaurant',
        slug: 'Test Restaurant Slug',
      };

      restaurantsServiceMock.findOne.mockResolvedValue(data);

      const result = await controller.findOne('test');

      expect(restaurantsServiceMock.findOne).toHaveBeenCalledExactlyOnceWith(
        'test',
      );

      expect(result).toEqual(data);
    });
  });

  describe('update', () => {
    it('should update a restaurant', async () => {
      const data = {
        id: 'test',
        name: 'Test Restaurant',
        slug: 'Test Restaurant Slug',
      };

      const updateDto = {
        name: 'TEST_UPDATE',
        slug: 'TEST_UPDATE_SLUG',
      };

      const updatedRestaurant = {
        ...data,
        ...updateDto,
      };

      restaurantsServiceMock.update.mockResolvedValue(updatedRestaurant);

      const result = await controller.update('test', updateDto);

      expect(restaurantsServiceMock.update).toHaveBeenCalledExactlyOnceWith(
        'test',
        updateDto,
      );

      expect(result).toEqual(updatedRestaurant);
    });
  });

  describe('remove', () => {
    it('should remove a restaurant', async () => {
      const data = {
        id: 'test',
        name: 'Test Restaurant',
        slug: 'Test Restaurant Slug',
      };

      restaurantsServiceMock.remove.mockResolvedValue(data);

      const result = await controller.remove('test');

      expect(restaurantsServiceMock.remove).toHaveBeenCalledExactlyOnceWith(
        'test',
      );

      expect(result).toEqual(data);
    });
  });
});
