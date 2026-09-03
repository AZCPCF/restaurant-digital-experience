import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RestaurantEntity } from './entities/restaurant.entity.js';
import { RestaurantFilterMapper } from './repositories/restaurant.filter-mapper.js';
import { RestaurantRepository } from './repositories/restaurant.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],

  providers: [RestaurantFilterMapper, RestaurantRepository],

  exports: [RestaurantRepository],
})
export class RestaurantsModule {}
