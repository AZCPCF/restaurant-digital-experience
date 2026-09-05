import { IsOptional } from 'class-validator';

export class FilterDto {
  @IsOptional()
  filter?: Record<string, Record<string, unknown>>;
}
