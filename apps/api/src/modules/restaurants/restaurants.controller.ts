import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { RestaurantsService } from './restaurants.service.js';
import { RestaurantEntity } from './entities/restaurant.entity.js';
import { QueryResult } from '../../common/query/query-result.js';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  create(
    @Body() createRestaurantDto: CreateRestaurantDto,
  ): Promise<RestaurantEntity> {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  findAll(): Promise<QueryResult<RestaurantEntity>> {
    return this.restaurantsService.findAll();
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
