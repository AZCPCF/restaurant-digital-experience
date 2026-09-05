import { BaseEntity } from '../entities/base.entity.js';

import { Filter } from './filter.js';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export type SortingDirection = 'ASC' | 'DESC';

export type SortingOptions<T extends BaseEntity> = {
  [K in keyof T]?: SortingDirection;
};

export interface QueryOptions<T extends BaseEntity> {
  pagination?: PaginationOptions;

  sorting?: SortingOptions<T>;

  filter?: Filter<T>;
}
