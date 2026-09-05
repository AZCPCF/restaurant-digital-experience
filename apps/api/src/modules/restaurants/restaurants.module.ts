import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RestaurantEntity } from './entities/restaurant.entity.js';

import { RestaurantFilterMapper } from './repositories/restaurant.filter-mapper.js';
import { RestaurantQueryMapper } from './repositories/restaurant.query-mapper.js';
import { RestaurantRepository } from './repositories/restaurant.repository.js';

import { RestaurantsController } from './restaurants.controller.js';
import { RestaurantsService } from './restaurants.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],

  providers: [
    RestaurantFilterMapper,
    RestaurantQueryMapper,
    RestaurantRepository,
    RestaurantsService,
  ],

  controllers: [RestaurantsController],

  exports: [RestaurantRepository],
})
export class RestaurantsModule {}
