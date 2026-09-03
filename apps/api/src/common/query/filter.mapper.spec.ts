import {
  Equal,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

import { BaseEntity } from '../entities/base.entity.js';
import { FilterMapper } from './filter.mapper.js';

class TestEntity extends BaseEntity {
  name: string;
  age: number;
}

describe('FilterMapper', () => {
  let mapper: FilterMapper<TestEntity>;

  beforeEach(() => {
    mapper = new FilterMapper();
  });

  it('should be defined', () => {
    expect(mapper).toBeDefined();
  });

  describe('toWhere', () => {
    it('should map eq operator', () => {
      const result = mapper.toWhere({
        name: {
          operator: 'eq',
          value: 'Restaurant',
        },
      });

      expect(result.name).toEqual(Equal('Restaurant'));
    });

    it('should map neq operator', () => {
      const result = mapper.toWhere({
        name: {
          operator: 'neq',
          value: 'Restaurant',
        },
      });

      expect(result.name).toEqual(Not(Equal('Restaurant')));
    });

    it('should map gt operator', () => {
      const result = mapper.toWhere({
        age: {
          operator: 'gt',
          value: 18,
        },
      });

      expect(result.age).toEqual(MoreThan(18));
    });

    it('should map gte operator', () => {
      const result = mapper.toWhere({
        age: {
          operator: 'gte',
          value: 18,
        },
      });

      expect(result.age).toEqual(MoreThanOrEqual(18));
    });

    it('should map lt operator', () => {
      const result = mapper.toWhere({
        age: {
          operator: 'lt',
          value: 18,
        },
      });

      expect(result.age).toEqual(LessThan(18));
    });

    it('should map lte operator', () => {
      const result = mapper.toWhere({
        age: {
          operator: 'lte',
          value: 18,
        },
      });

      expect(result.age).toEqual(LessThanOrEqual(18));
    });

    it('should map in operator', () => {
      const result = mapper.toWhere({
        age: {
          operator: 'in',
          value: [18, 20, 25],
        },
      });

      expect(result.age).toEqual(In([18, 20, 25]));
    });

    it('should map like operator', () => {
      const result = mapper.toWhere({
        name: {
          operator: 'like',
          value: '%restaurant%',
        },
      });

      expect(result.name).toEqual(Like('%restaurant%'));
    });

    it('should map multiple filters', () => {
      const result = mapper.toWhere({
        name: {
          operator: 'eq',
          value: 'Restaurant',
        },
        age: {
          operator: 'gte',
          value: 18,
        },
      });

      expect(result).toEqual({
        name: Equal('Restaurant'),
        age: MoreThanOrEqual(18),
      });
    });
  });
});
