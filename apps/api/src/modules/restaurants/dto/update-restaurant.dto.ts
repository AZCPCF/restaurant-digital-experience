import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from './create-restaurant.dto.js';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
