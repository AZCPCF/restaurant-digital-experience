import {
  Equal,
  FindOptionsWhere,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity.js';
import { Filter, FilterCondition } from './filter.js';

export class FilterMapper<T extends BaseEntity> {
  toWhere(filter: Filter<T>): FindOptionsWhere<T> {
    const entries = Object.entries(filter).map(
      ([key, condition]) => [key, this.toFindOperator(condition)] as const,
    );

    return Object.fromEntries(entries) as FindOptionsWhere<T>;
  }

  private toFindOperator<V>(condition: FilterCondition<V>) {
    switch (condition.operator) {
      case 'eq':
        return Equal(condition.value);

      case 'neq':
        return Not(Equal(condition.value));

      case 'gt':
        return MoreThan(condition.value);

      case 'gte':
        return MoreThanOrEqual(condition.value);

      case 'lt':
        return LessThan(condition.value);

      case 'lte':
        return LessThanOrEqual(condition.value);

      case 'in':
        return In(condition.value);

      case 'like':
        return Like(condition.value);
    }
  }
}
