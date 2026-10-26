import { Injectable, NotFoundException } from '@nestjs/common';
import slug from 'slug';
import { RestaurantRepository } from '../restaurants/repositories/restaurant.repository.js';
import { CreateMenuDto } from './dto/create-menu.dto.js';
import { UpdateMenuDto } from './dto/update-menu.dto.js';
import { MenuEntity } from './entities/menu.entity.js';
import { MenuRepository } from './repositories/menu.repository.js';
import { QueryOptions } from '../../common/query/query-options.js';
import { QueryResult } from '../../common/query/query-result.js';

@Injectable()
export class MenusService {
  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly restaurantRepository: RestaurantRepository,
  ) {}
  async create(createMenuDto: CreateMenuDto): Promise<MenuEntity> {
    const restaurant = await this.restaurantRepository.findOne(
      createMenuDto.restaurantId,
    );
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return this.menuRepository.create({
      ...createMenuDto,
      restaurant,
      slug: slug(createMenuDto.name),
    });
  }

  async findAll(
    options?: QueryOptions<MenuEntity>,
  ): Promise<QueryResult<MenuEntity>> {
    return this.menuRepository.findAll(options);
  }

  async findOne(
    id: string,
    options?: QueryOptions<MenuEntity>,
  ): Promise<MenuEntity> {
    const menu = await this.menuRepository.findOne(id, options);
    if (!menu) {
      throw new NotFoundException();
    }
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<MenuEntity> {
    const menu = await this.menuRepository.update(
      { id: [{ operator: 'eq', value: id }] },
      updateMenuDto,
    );
    if (!menu) {
      throw new NotFoundException();
    }
    return menu;
  }

  async remove(id: string): Promise<MenuEntity> {
    const menu = await this.menuRepository.remove({
      id: [{ operator: 'eq', value: id }],
    });
    if (!menu) {
      throw new NotFoundException();
    }
    return menu;
  }
}
