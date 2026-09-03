import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @MinLength(4)
  name: string;
}
