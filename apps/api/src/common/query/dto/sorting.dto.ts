import { IsOptional, IsString } from 'class-validator';

export class SortingDto {
  @IsOptional()
  @IsString()
  sort?: string;
}
