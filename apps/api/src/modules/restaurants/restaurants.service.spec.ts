import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Mock } from 'vitest';
import slug from 'slug';

import { RestaurantsService } from './restaurants.service.js';
import { RestaurantRepository } from './repositories/restaurant.repository.js';

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let restaurantRepository: RestaurantRepository;

  let restaurantRepositoryMock: {
    create: Mock;
    findAll: Mock;
    findOne: Mock;
    update: Mock;
    remove: Mock;
  };

  const restaurant = {
    id: 'restaurant1-id',
    name: 'Test Restaurant',
    slug: slug('Test Restaurant'),
    menus: [],
  };

  beforeEach(async () => {
    restaurantRepositoryMock = {
      create: vitest.fn(),
      findAll: vitest.fn(),
      findOne: vitest.fn(),
      update: vitest.fn(),
      remove: vitest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: RestaurantRepository,
          useValue: restaurantRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);

    restaurantRepository =
      module.get<RestaurantRepository>(RestaurantRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a restaurant', async () => {
      const dto = {
        name: 'Test Restaurant',
      };

      restaurantRepositoryMock.create.mockResolvedValue(restaurant);

      const result = await service.create(dto);

      expect(restaurantRepositoryMock.create).toHaveBeenCalledExactlyOnceWith({
        name: dto.name,
        slug: slug(dto.name),
        menus: [],
      });

      expect(result).toEqual(restaurant);
    });
  });

  describe('findAll', () => {
    it('should return restaurants', async () => {
      const options = {
        pagination: {
          page: 1,
          limit: 20,
        },
      };

      const data = {
        data: [restaurant],
        page: 1,
        limit: 20,
        pages: 1,
        total: 1,
        hasNext: false,
      };

      restaurantRepositoryMock.findAll.mockResolvedValue(data);

      const result = await service.findAll(options);

      expect(restaurantRepositoryMock.findAll).toHaveBeenCalledExactlyOnceWith(
        options,
      );

      expect(result).toEqual(data);
    });

    it('should return restaurants without options', async () => {
      const data = {
        data: [restaurant],
        page: 1,
        limit: 20,
        pages: 1,
        total: 1,
        hasNext: false,
      };

      restaurantRepositoryMock.findAll.mockResolvedValue(data);

      const result = await service.findAll();

      expect(restaurantRepositoryMock.findAll).toHaveBeenCalledExactlyOnceWith(
        undefined,
      );

      expect(result).toEqual(data);
    });
  });

  describe('findOne', () => {
    it('should return a restaurant by id', async () => {
      restaurantRepositoryMock.findOne.mockResolvedValue(restaurant);

      const result = await service.findOne(restaurant.id);

      expect(restaurantRepositoryMock.findOne).toHaveBeenCalledExactlyOnceWith(
        restaurant.id,
        undefined,
      );

      expect(result).toEqual(restaurant);
    });

    it('should return a restaurant by id with options', async () => {
      restaurantRepositoryMock.findOne.mockResolvedValue(restaurant);

      const result = await service.findOne(restaurant.id, {
        sorting: { created_at: 'ASC' },
      });

      expect(restaurantRepositoryMock.findOne).toHaveBeenCalledExactlyOnceWith(
        restaurant.id,
        { sorting: { created_at: 'ASC' } },
      );

      expect(result).toEqual(restaurant);
    });

    it("should throw NotFoundException when restaurant doesn't exist", async () => {
      restaurantRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.findOne(restaurant.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(restaurantRepositoryMock.findOne).toHaveBeenCalledExactlyOnceWith(
        restaurant.id,
        undefined,
      );
    });
  });

  describe('update', () => {
    it('should update a restaurant with name', async () => {
      const updateDto = {
        name: 'Updated Restaurant',
      };

      const updatedRestaurant = {
        ...restaurant,
        name: updateDto.name,
        slug: slug(updateDto.name),
      };

      restaurantRepositoryMock.update.mockResolvedValue(updatedRestaurant);

      const result = await service.update(restaurant.id, updateDto);

      expect(restaurantRepositoryMock.update).toHaveBeenCalledExactlyOnceWith(
        {
          id: [
            {
              operator: 'eq',
              value: restaurant.id,
            },
          ],
        },
        {
          name: updateDto.name,
          slug: slug(updateDto.name),
        },
      );

      expect(result).toEqual(updatedRestaurant);
    });

    it('should update a restaurant without changing slug when name is not provided', async () => {
      const updateDto = {};

      const updatedRestaurant = {
        ...restaurant,
      };

      restaurantRepositoryMock.update.mockResolvedValue(updatedRestaurant);

      const result = await service.update(restaurant.id, updateDto);

      expect(restaurantRepositoryMock.update).toHaveBeenCalledExactlyOnceWith(
        {
          id: [
            {
              operator: 'eq',
              value: restaurant.id,
            },
          ],
        },
        {
          name: undefined,
        },
      );

      expect(result).toEqual(updatedRestaurant);
    });

    it("should throw NotFoundException when restaurant doesn't exist", async () => {
      const updateDto = {
        name: 'Updated Restaurant',
      };

      restaurantRepositoryMock.update.mockResolvedValue(null);

      await expect(service.update(restaurant.id, updateDto)).rejects.toThrow(
        NotFoundException,
      );

      await expect(service.update(restaurant.id, updateDto)).rejects.toThrow(
        `Restaurant with id ${restaurant.id} not found`,
      );

      expect(restaurantRepositoryMock.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a restaurant', async () => {
      restaurantRepositoryMock.remove.mockResolvedValue(restaurant);

      const result = await service.remove(restaurant.id);

      expect(restaurantRepositoryMock.remove).toHaveBeenCalledExactlyOnceWith({
        id: [
          {
            operator: 'eq',
            value: restaurant.id,
          },
        ],
      });

      expect(result).toEqual(restaurant);
    });

    it("should throw NotFoundException when restaurant doesn't exist", async () => {
      restaurantRepositoryMock.remove.mockResolvedValue(null);

      await expect(service.remove(restaurant.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(restaurantRepositoryMock.remove).toHaveBeenCalledExactlyOnceWith({
        id: [
          {
            operator: 'eq',
            value: restaurant.id,
          },
        ],
      });
    });
  });
});
