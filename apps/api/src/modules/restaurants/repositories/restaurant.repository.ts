import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from '../../../common/repositories/repository.base.js';
import { RestaurantFilterMapper } from './restaurant.filter-mapper.js';

import { RestaurantEntity } from '../entities/restaurant.entity.js';

export class RestaurantRepository extends BaseRepository<RestaurantEntity> {
  constructor(
    @InjectRepository(RestaurantEntity)
    protected readonly repository: Repository<RestaurantEntity>,

    protected readonly filterMapper: RestaurantFilterMapper,
  ) {
    super(repository, filterMapper);
  }
}
