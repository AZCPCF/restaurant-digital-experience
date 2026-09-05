import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { QueryDto } from '../../common/query/dto/query.dto.js';
import { QueryResult } from '../../common/query/query-result.js';

import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';

import { RestaurantEntity } from './entities/restaurant.entity.js';

import { RestaurantsService } from './restaurants.service.js';
import { RestaurantQueryMapper } from './repositories/restaurant.query-mapper.js';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly queryMapper: RestaurantQueryMapper,
  ) {}

  @Post()
  create(
    @Body() createRestaurantDto: CreateRestaurantDto,
  ): Promise<RestaurantEntity> {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  findAll(@Query() query: QueryDto): Promise<QueryResult<RestaurantEntity>> {
    const options = this.queryMapper.toOptions(query);
    return this.restaurantsService.findAll(options);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RestaurantEntity | null> {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<RestaurantEntity | null> {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RestaurantEntity | null> {
    return this.restaurantsService.remove(id);
  }
}
