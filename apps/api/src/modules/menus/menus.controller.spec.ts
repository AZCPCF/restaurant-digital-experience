import { Test, TestingModule } from '@nestjs/testing';
import slug from 'slug';
import { Mock } from 'vitest';
import { MenusController } from './menus.controller.js';
import { MenusService } from './menus.service.js';
import { MenuQueryMapper } from './repositories/menu.query-mapper.js';

describe('MenusController', () => {
  let controller: MenusController;
  let menusServiceMock: {
    create: Mock;
    findAll: Mock;
    findOne: Mock;
    update: Mock;
    remove: Mock;
  };
  let queryMapperMock: {
    toOptions: Mock;
  };

  const restaurantId = 'restaurant1-id';

  const createMenuDto = {
    name: 'Test Menu',
    restaurantId,
  };

  const menu = {
    id: 'menu1-id',
    ...createMenuDto,
  };

  beforeEach(async () => {
    menusServiceMock = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };
    queryMapperMock = {
      toOptions: vi.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenusController],
      providers: [
        {
          provide: MenusService,
          useValue: menusServiceMock,
        },
        {
          provide: MenuQueryMapper,
          useValue: queryMapperMock,
        },
      ],
    }).compile();

    controller = module.get<MenusController>(MenusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should create a menu', async () => {
      menusServiceMock.create.mockResolvedValue(menu);

      const result = await controller.create(createMenuDto);

      expect(menusServiceMock.create).toHaveBeenCalledExactlyOnceWith(
        createMenuDto,
      );

      expect(result).toEqual(menu);
    });
  });
  describe('findAll', () => {
    it('should map query and return menus', async () => {
      const query = {
        page: 2,
        limit: 10,
        sort: 'name:DESC',
        filter: {
          name: {
            like: 'Garden',
          },
        },
      };

      const options = {
        pagination: {
          page: 2,
          limit: 10,
        },
        sorting: {
          name: 'DESC',
        },
        filter: {
          name: [
            {
              operator: 'like',
              value: 'Garden',
            },
          ],
        },
      };

      const data = {
        data: [],
        page: 2,
        limit: 10,
        pages: 0,
        total: 0,
        hasNext: false,
      };

      queryMapperMock.toOptions.mockReturnValue(options);
      menusServiceMock.findAll.mockResolvedValue(data);

      const result = await controller.findAll(query);

      expect(queryMapperMock.toOptions).toHaveBeenCalledExactlyOnceWith(query);
      expect(menusServiceMock.findAll).toHaveBeenCalledExactlyOnceWith(options);
      expect(result).toEqual(data);
    });
    it('should use mapped default options when query is empty', async () => {
      const query = {};

      const options = {
        pagination: {
          page: 1,
          limit: 20,
        },
      };

      const data = {
        data: [],
        page: 1,
        limit: 20,
        pages: 0,
        total: 0,
        hasNext: false,
      };

      queryMapperMock.toOptions.mockReturnValue(options);
      menusServiceMock.findAll.mockResolvedValue(data);

      const result = await controller.findAll(query);

      expect(queryMapperMock.toOptions).toHaveBeenCalledExactlyOnceWith(query);

      expect(menusServiceMock.findAll).toHaveBeenCalledExactlyOnceWith(options);

      expect(result).toEqual(data);
    });
  });
  describe('findOne', () => {
    it('should return a menu by id', async () => {
      menusServiceMock.findOne.mockResolvedValue(menu);

      const result = await controller.findOne(menu.id);

      expect(menusServiceMock.findOne).toHaveBeenCalledExactlyOnceWith(menu.id);
      expect(result).toEqual(menu);
    });
  });
  describe('update', () => {
    it('should update a restaurant', async () => {
      const updateDto = {
        name: 'Updated Menu',
      };
      const updatedMenu = {
        id: 'menu1-id',
        name: updateDto.name,
        slug: slug(updateDto.name),
      };

      menusServiceMock.update.mockResolvedValue(updatedMenu);

      const result = await controller.update('menu1-id', updateDto);

      expect(menusServiceMock.update).toHaveBeenCalledExactlyOnceWith(
        'menu1-id',
        updateDto,
      );
      expect(result).toEqual(updatedMenu);
    });
  });

  describe('remove', () => {
    it('should remove a menu', async () => {
      const menu = {
        id: 'menu1-id',
        name: 'Test Menu',
        slug: slug('Test Menu'),
      };

      menusServiceMock.remove.mockResolvedValue(menu);

      const result = await controller.remove('menu1-id');

      expect(menusServiceMock.remove).toHaveBeenCalledExactlyOnceWith(
        'menu1-id',
      );

      expect(result).toEqual(menu);
    });
  });
});
