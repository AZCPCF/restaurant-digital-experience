import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(255)
  name: string;
}
