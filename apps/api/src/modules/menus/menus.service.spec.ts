import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import slug from 'slug';

import { RestaurantRepository } from '../restaurants/repositories/restaurant.repository.js';
import { MenusService } from './menus.service.js';
import { MenuRepository } from './repositories/menu.repository.js';

describe('MenusService', () => {
  let service: MenusService;
  let menuRepository: MenuRepository;
  let restaurantRepository: RestaurantRepository;

  const restaurantId = 'restaurant1-id';

  const createMenuDto = {
    name: 'Test Menu',
    restaurantId,
  };

  const restaurant = {
    id: restaurantId,
    name: 'Test Restaurant',
    slug: slug('Test Restaurant'),
  };

  const menu = {
    id: 'menu1-id',
    name: createMenuDto.name,
    restaurantId: createMenuDto.restaurantId,
    restaurant,
    slug: slug(createMenuDto.name),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenusService,
        {
          provide: MenuRepository,
          useValue: {
            create: vi.fn(),
            findAll: vi.fn(),
            findOne: vi.fn(),
            update: vi.fn(),
            remove: vi.fn(),
          },
        },
        {
          provide: RestaurantRepository,
          useValue: {
            findOne: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MenusService>(MenusService);

    menuRepository = module.get<MenuRepository>(MenuRepository);

    restaurantRepository =
      module.get<RestaurantRepository>(RestaurantRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a menu', async () => {
      vi.mocked(restaurantRepository.findOne).mockResolvedValue(
        restaurant as any,
      );

      vi.mocked(menuRepository.create).mockResolvedValue(menu as any);

      const result = await service.create(createMenuDto);

      expect(restaurantRepository.findOne).toHaveBeenCalledExactlyOnceWith(
        createMenuDto.restaurantId,
      );

      expect(menuRepository.create).toHaveBeenCalledExactlyOnceWith({
        ...createMenuDto,
        restaurant,
        slug: slug(createMenuDto.name),
      });

      expect(result).toEqual(menu);
    });

    it("should throw NotFoundException when restaurant doesn't exist", async () => {
      vi.mocked(restaurantRepository.findOne).mockResolvedValue(null);

      await expect(service.create(createMenuDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(restaurantRepository.findOne).toHaveBeenCalledExactlyOnceWith(
        createMenuDto.restaurantId,
      );

      expect(menuRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return menus', async () => {
      const options = {
        pagination: {
          page: 1,
          limit: 20,
        },
      };

      const data = {
        data: [menu],
        page: 1,
        limit: 20,
        pages: 1,
        total: 1,
        hasNext: false,
      };

      vi.mocked(menuRepository.findAll).mockResolvedValue(data as any);

      const result = await service.findAll(options);

      expect(menuRepository.findAll).toHaveBeenCalledExactlyOnceWith(options);

      expect(result).toEqual(data);
    });
  });

  describe('findOne', () => {
    it('should return a menu by id', async () => {
      vi.mocked(menuRepository.findOne).mockResolvedValue(menu as any);

      const result = await service.findOne(menu.id);

      expect(menuRepository.findOne).toHaveBeenCalledExactlyOnceWith(
        menu.id,
        undefined,
      );

      expect(result).toEqual(menu);
    });

    it("should throw NotFoundException when menu doesn't exist", async () => {
      vi.mocked(menuRepository.findOne).mockResolvedValue(null);

      await expect(service.findOne(menu.id)).rejects.toThrow(NotFoundException);

      expect(menuRepository.findOne).toHaveBeenCalledExactlyOnceWith(
        menu.id,
        undefined,
      );
    });

    it('should pass query options to repository', async () => {
      vi.mocked(menuRepository.findOne).mockResolvedValue(menu as any);

      const result = await service.findOne(menu.id, {
        sorting: { restaurant: 'ASC' },
      });

      expect(menuRepository.findOne).toHaveBeenCalledExactlyOnceWith(menu.id, {
        sorting: { restaurant: 'ASC' },
      });

      expect(result).toEqual(menu);
    });
  });

  describe('update', () => {
    it('should update a menu', async () => {
      const updateDto = {
        name: 'Updated Menu',
      };

      const updatedMenu = {
        ...menu,
        name: updateDto.name,
        slug: slug(updateDto.name),
      };

      vi.mocked(menuRepository.update).mockResolvedValue(updatedMenu as any);

      const result = await service.update(menu.id, updateDto);

      expect(menuRepository.update).toHaveBeenCalledExactlyOnceWith(
        {
          id: [
            {
              operator: 'eq',
              value: menu.id,
            },
          ],
        },
        updateDto,
      );

      expect(result).toEqual(updatedMenu);
    });

    it("should throw NotFoundException when menu doesn't exist", async () => {
      const updateDto = {
        name: 'Updated Menu',
      };

      vi.mocked(menuRepository.update).mockResolvedValue(null);

      await expect(service.update(menu.id, updateDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(menuRepository.update).toHaveBeenCalledExactlyOnceWith(
        {
          id: [
            {
              operator: 'eq',
              value: menu.id,
            },
          ],
        },
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a menu', async () => {
      vi.mocked(menuRepository.remove).mockResolvedValue(menu as any);

      const result = await service.remove(menu.id);

      expect(menuRepository.remove).toHaveBeenCalledExactlyOnceWith({
        id: [
          {
            operator: 'eq',
            value: menu.id,
          },
        ],
      });

      expect(result).toEqual(menu);
    });

    it("should throw NotFoundException when menu doesn't exist", async () => {
      vi.mocked(menuRepository.remove).mockResolvedValue(null);

      await expect(service.remove(menu.id)).rejects.toThrow(NotFoundException);

      expect(menuRepository.remove).toHaveBeenCalledExactlyOnceWith({
        id: [
          {
            operator: 'eq',
            value: menu.id,
          },
        ],
      });
    });
  });
});
