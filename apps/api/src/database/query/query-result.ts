import { BaseEntity } from '../entities/base.entity.js';

export interface QueryResult<T extends BaseEntity> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
}
