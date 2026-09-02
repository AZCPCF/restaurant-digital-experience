import { BaseEntity } from '../entities/base.entity.js';
import { Filter } from './filter.js';

export interface QueryOptions<T extends BaseEntity> {
  pagination?: {
    page: number;
    limit: number;
  };

  sorting?: {
    [t in keyof T]?: 'ASC' | 'DESC';
  };

  filter?: Filter<T>;
}
