import { Mock } from 'vitest';
import { RestaurantRepository } from './repositories/restaurant.repository.js';
import { RestaurantsService } from './restaurants.service.js';
import { Test, TestingModule } from '@nestjs/testing';

describe('RestaurantsService', () => {
  let service: RestaurantsService;

  let restaurantRepositoryMock: {
    create: Mock;
    findAll: Mock;
    findOne: Mock;
    update: Mock;
    remove: Mock;
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a restaurant', async () => {
      const dto = { name: 'Test Restaurant', slug: 'test-restaurant' };

      restaurantRepositoryMock.create.mockResolvedValue(dto);

      const result = await service.create(dto);

      expect(restaurantRepositoryMock.create).toHaveBeenCalledExactlyOnceWith(
        dto,
      );

      expect(result).toEqual(dto);
    });
  });

  describe('findAll', () => {
    it('should return restaurants', async () => {
      const data = {
        data: [],
        page: 1,
        limit: 20,
        pages: 0,
        total: 0,
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
    it('should find restaurant by id', async () => {
      const restaurant = {
        id: 'r-1',
        name: 'Test',
      };

      restaurantRepositoryMock.findOne.mockResolvedValue(restaurant);

      const result = await service.findOne('r-1', undefined);

      expect(restaurantRepositoryMock.findOne).toHaveBeenCalledExactlyOnceWith(
        'r-1',
        undefined,
      );

      expect(result).toEqual(restaurant);
    });
  });

  describe('update', () => {
    it('should update restaurant', async () => {
      const dto = {
        name: 'Updated',
      };

      const restaurant = {
        id: 'r-1',
        name: 'Updated',
      };

      restaurantRepositoryMock.update.mockResolvedValue(restaurant);

      const result = await service.update('r-1', dto);

      expect(restaurantRepositoryMock.update).toHaveBeenCalledExactlyOnceWith(
        {
          id: {
            operator: 'eq',
            value: 'r-1',
          },
        },
        dto,
      );

      expect(result).toEqual(restaurant);
    });
  });
  describe('remove', () => {
    it('should remove restaurant', async () => {
      const restaurant = {
        id: 'r-1',
      };

      restaurantRepositoryMock.remove.mockResolvedValue(restaurant);

      const result = await service.remove('r-1');

      expect(restaurantRepositoryMock.remove).toHaveBeenCalledExactlyOnceWith({
        id: {
          operator: 'eq',
          value: 'r-1',
        },
      });

      expect(result).toEqual(restaurant);
    });
  });
});
