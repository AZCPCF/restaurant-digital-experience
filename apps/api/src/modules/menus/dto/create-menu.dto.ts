import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(255)
  name: string;

  @IsEmpty()
  description?: string;

  @IsNotEmpty()
  @IsUUID()
  restaurantId: string;

  @IsEmpty()
  @IsBoolean()
  isActive?: boolean;
}
