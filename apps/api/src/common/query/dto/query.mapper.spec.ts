import { BadRequestException } from '@nestjs/common';

import { BaseEntity } from '../../entities/base.entity.js';

import { QueryDto } from './query.dto.js';
import { QueryMapper } from './query.mapper.js';

class TestEntity extends BaseEntity {
  name: string;

  age: number;

  createdAt: Date;
}

describe('QueryMapper', () => {
  let mapper: QueryMapper<TestEntity>;

  beforeEach(() => {
    mapper = new QueryMapper<TestEntity>({
      name: String,
      age: Number,
      createdAt: (value: string) => new Date(value),
    });
  });

  it('should be defined', () => {
    expect(mapper).toBeDefined();
  });

  describe('toOptions', () => {
    it('should use default pagination', () => {
      const query: QueryDto = {};

      const result = mapper.toOptions(query);

      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
      });
    });

    it('should map pagination', () => {
      const query: QueryDto = {
        page: 2,
        limit: 10,
      };

      const result = mapper.toOptions(query);

      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
      });
    });

    it('should map single sorting', () => {
      const query: QueryDto = {
        sort: 'name:ASC',
      };

      const result = mapper.toOptions(query);

      expect(result.sorting).toEqual({
        name: 'ASC',
      });
    });

    it('should map multiple sorting fields', () => {
      const query: QueryDto = {
        sort: 'name:ASC,createdAt:DESC',
      };

      const result = mapper.toOptions(query);

      expect(result.sorting).toEqual({
        name: 'ASC',
        createdAt: 'DESC',
      });
    });

    it('should default sorting direction to ASC', () => {
      const query: QueryDto = {
        sort: 'name',
      };

      const result = mapper.toOptions(query);

      expect(result.sorting).toEqual({
        name: 'ASC',
      });
    });

    it('should map eq filter', () => {
      const query: QueryDto = {
        filter: {
          name: {
            eq: 'Restaurant',
          },
        },
      };

      const result = mapper.toOptions(query);

      expect(result.filter).toEqual({
        name: [
          {
            operator: 'eq',
            value: 'Restaurant',
          },
        ],
      });
    });

    it('should map numeric filter', () => {
      const query: QueryDto = {
        filter: {
          age: {
            eq: '18',
          },
        },
      };

      const result = mapper.toOptions(query);

      expect(result.filter).toEqual({
        age: [
          {
            operator: 'eq',
            value: 18,
          },
        ],
      });
    });

    it('should map date filter', () => {
      const query: QueryDto = {
        filter: {
          createdAt: {
            eq: '2026-01-01',
          },
        },
      };

      const result = mapper.toOptions(query);

      expect(result.filter).toEqual({
        createdAt: [
          {
            operator: 'eq',
            value: new Date('2026-01-01'),
          },
        ],
      });
    });

    it('should map multiple filters', () => {
      const query: QueryDto = {
        filter: {
          name: {
            eq: 'Restaurant',
          },
          age: {
            gte: '18',
          },
        },
      };

      const result = mapper.toOptions(query);

      expect(result.filter).toEqual({
        name: [
          {
            operator: 'eq',
            value: 'Restaurant',
          },
        ],
        age: [
          {
            operator: 'gte',
            value: 18,
          },
        ],
      });
    });

    it('should map multiple conditions on the same field', () => {
      const query: QueryDto = {
        filter: {
          age: {
            gte: '18',
            lte: '30',
          },
        },
      };

      const result = mapper.toOptions(query);

      expect(result.filter).toEqual({
        age: [
          {
            operator: 'gte',
            value: 18,
          },
          {
            operator: 'lte',
            value: 30,
          },
        ],
      });
    });

    it('should map in filter', () => {
      const query: QueryDto = {
        filter: {
          age: {
            in: '18,20,25',
          },
        },
      };

      const result = mapper.toOptions(query);

      expect(result.filter).toEqual({
        age: [
          {
            operator: 'in',
            value: [18, 20, 25],
          },
        ],
      });
    });

    it('should map string in filter', () => {
      const query: QueryDto = {
        filter: {
          name: {
            in: 'McDonalds,Burger King,KFC',
          },
        },
      };

      const result = mapper.toOptions(query);

      expect(result.filter).toEqual({
        name: [
          {
            operator: 'in',
            value: ['McDonalds', 'Burger King', 'KFC'],
          },
        ],
      });
    });

    it('should map like filter', () => {
      const query: QueryDto = {
        filter: {
          name: {
            like: '%restaurant%',
          },
        },
      };

      const result = mapper.toOptions(query);

      expect(result.filter).toEqual({
        name: [
          {
            operator: 'like',
            value: '%restaurant%',
          },
        ],
      });
    });

    it('should map date range filter', () => {
      const query: QueryDto = {
        filter: {
          createdAt: {
            gte: '2026-01-01',
            lte: '2026-12-31',
          },
        },
      };

      const result = mapper.toOptions(query);

      expect(result.filter).toEqual({
        createdAt: [
          {
            operator: 'gte',
            value: new Date('2026-01-01'),
          },
          {
            operator: 'lte',
            value: new Date('2026-12-31'),
          },
        ],
      });
    });
  });

  describe('validation', () => {
    it('should throw when field is invalid', () => {
      const query: QueryDto = {
        filter: {
          invalidField: {
            eq: 'value',
          },
        },
      };

      expect(() => mapper.toOptions(query)).toThrow(
        new BadRequestException('Invalid query field: invalidField'),
      );
    });

    it('should throw when filter operator is invalid', () => {
      const query: QueryDto = {
        filter: {
          name: {
            invalidOperator: 'value',
          },
        },
      };

      expect(() => mapper.toOptions(query)).toThrow(
        new BadRequestException('Invalid filter operator: invalidOperator'),
      );
    });

    it('should throw when sort field is invalid', () => {
      const query: QueryDto = {
        sort: 'invalidField:ASC',
      };

      expect(() => mapper.toOptions(query)).toThrow(
        new BadRequestException('Invalid query field: invalidField'),
      );
    });

    it('should throw when sort direction is invalid', () => {
      const query: QueryDto = {
        sort: 'name:INVALID',
      };

      expect(() => mapper.toOptions(query)).toThrow(
        new BadRequestException('Invalid sort direction: INVALID'),
      );
    });
  });
});
