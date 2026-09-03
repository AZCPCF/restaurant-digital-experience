import { Injectable } from '@nestjs/common';
import { QueryOptions } from '../../common/query/query-options.js';
import { QueryResult } from '../../common/query/query-result.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { RestaurantEntity } from './entities/restaurant.entity.js';
import { RestaurantRepository } from './repositories/restaurant.repository.js';

@Injectable()
export class RestaurantsService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}
  async create(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<RestaurantEntity> {
    return this.restaurantRepository.create(createRestaurantDto);
  }

  async findAll(
    options?: QueryOptions<RestaurantEntity>,
  ): Promise<QueryResult<RestaurantEntity>> {
    return this.restaurantRepository.findAll(options);
  }

  async findOne(
    id: string,
    options?: QueryOptions<RestaurantEntity>,
  ): Promise<RestaurantEntity | null> {
    return this.restaurantRepository.findOne(id, options);
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<RestaurantEntity | null> {
    return this.restaurantRepository.update(
      { id: { operator: 'eq', value: id } },
      updateRestaurantDto,
    );
  }

  async remove(id: string): Promise<RestaurantEntity | null> {
    return this.restaurantRepository.remove({
      id: { operator: 'eq', value: id },
    });
  }
}
