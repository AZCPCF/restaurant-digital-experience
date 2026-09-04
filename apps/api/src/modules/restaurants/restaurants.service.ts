import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryOptions } from '../../common/query/query-options.js';
import { QueryResult } from '../../common/query/query-result.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { RestaurantEntity } from './entities/restaurant.entity.js';
import { RestaurantRepository } from './repositories/restaurant.repository.js';
import slug from 'slug';

@Injectable()
export class RestaurantsService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}
  async create({ name }: CreateRestaurantDto): Promise<RestaurantEntity> {
    return this.restaurantRepository.create({
      name,
      slug: slug(name),
    });
  }

  async findAll(
    options?: QueryOptions<RestaurantEntity>,
  ): Promise<QueryResult<RestaurantEntity>> {
    return this.restaurantRepository.findAll(options);
  }

  async findOne(
    id: string,
    options?: QueryOptions<RestaurantEntity>,
  ): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findOne(id, options);
    if (!restaurant) {
      throw new NotFoundException();
    }
    return restaurant;
  }

  async update(
    id: string,
    { name }: UpdateRestaurantDto,
  ): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.update(
      { id: { operator: 'eq', value: id } },
      {
        name,
        ...(name ? { slug: slug(name) } : {}),
      },
    );

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    return restaurant;
  }

  async remove(id: string): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.remove({
      id: { operator: 'eq', value: id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    return restaurant;
  }
}
