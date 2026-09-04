import { Test, TestingModule } from '@nestjs/testing';
import { Mock } from 'vitest';
import slug from 'slug';

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
      };

      const restaurant = {
        id: 'r-1',
        name: dto.name,
        slug: slug(dto.name),
      };

      restaurantsServiceMock.create.mockResolvedValue(restaurant);

      const result = await controller.create(dto);

      expect(restaurantsServiceMock.create).toHaveBeenCalledExactlyOnceWith(
        dto,
      );

      expect(result).toEqual(restaurant);
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
        id: 'r-1',
        name: 'Test Restaurant',
        slug: slug('Test Restaurant'),
      };

      restaurantsServiceMock.findOne.mockResolvedValue(data);

      const result = await controller.findOne('r-1');

      expect(restaurantsServiceMock.findOne).toHaveBeenCalledExactlyOnceWith(
        'r-1',
      );

      expect(result).toEqual(data);
    });
  });

  describe('update', () => {
    it('should update a restaurant', async () => {
      const updateDto = {
        name: 'Updated Restaurant',
      };

      const updatedRestaurant = {
        id: 'r-1',
        name: updateDto.name,
        slug: slug(updateDto.name),
      };

      restaurantsServiceMock.update.mockResolvedValue(updatedRestaurant);

      const result = await controller.update('r-1', updateDto);

      expect(restaurantsServiceMock.update).toHaveBeenCalledExactlyOnceWith(
        'r-1',
        updateDto,
      );

      expect(result).toEqual(updatedRestaurant);
    });
  });

  describe('remove', () => {
    it('should remove a restaurant', async () => {
      const restaurant = {
        id: 'r-1',
        name: 'Test Restaurant',
        slug: slug('Test Restaurant'),
      };

      restaurantsServiceMock.remove.mockResolvedValue(restaurant);

      const result = await controller.remove('r-1');

      expect(restaurantsServiceMock.remove).toHaveBeenCalledExactlyOnceWith(
        'r-1',
      );

      expect(result).toEqual(restaurant);
    });
  });
});
