import { Injectable } from '@nestjs/common';

import { QueryMapper } from '../../../common/query/dto/query.mapper.js';

import { RestaurantEntity } from '../entities/restaurant.entity.js';

@Injectable()
export class RestaurantQueryMapper extends QueryMapper<RestaurantEntity> {
  constructor() {
    super({
      id: String,
      name: String,
      slug: String,

      created_at: (value) => new Date(value),
      updated_at: (value) => new Date(value),
    });
  }
}
