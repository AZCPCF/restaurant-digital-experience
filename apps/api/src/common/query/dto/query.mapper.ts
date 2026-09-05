import { BadRequestException } from '@nestjs/common';

import { BaseEntity } from '../../entities/base.entity.js';

import { Filter, FilterCondition } from '../filter.js';
import { QueryOptions, SortingDirection } from '../query-options.js';

import { QueryDto } from './query.dto.js';

type FilterOperator =
  'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';

type QueryValueParser<V> = (value: string) => V;

export type QueryFieldConfig<T extends BaseEntity> = Partial<{
  [K in keyof T]: QueryValueParser<T[K]>;
}>;

const FILTER_OPERATORS: FilterOperator[] = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'like',
  'in',
];

const SORT_DIRECTIONS: SortingDirection[] = ['ASC', 'DESC'];

export class QueryMapper<T extends BaseEntity> {
  constructor(private readonly fieldConfig: QueryFieldConfig<T>) {}

  toOptions(query: QueryDto): QueryOptions<T> {
    return {
      pagination: {
        page: query.page ?? 1,
        limit: query.limit ?? 20,
      },

      sorting: query.sort ? this.parseSorting(query.sort) : undefined,

      filter: query.filter ? this.parseFilter(query.filter) : undefined,
    };
  }

  private parseSorting(sort: string): QueryOptions<T>['sorting'] {
    const entries = sort.split(',').map((item) => {
      const [field, direction = 'ASC'] = item.split(':');

      if (!field) {
        throw new BadRequestException('Sort field is required');
      }

      this.validateField(field);

      const normalizedDirection = direction.toUpperCase();

      if (!SORT_DIRECTIONS.includes(normalizedDirection as SortingDirection)) {
        throw new BadRequestException(`Invalid sort direction: ${direction}`);
      }

      return [field, normalizedDirection as SortingDirection] as const;
    });

    return Object.fromEntries(entries) as QueryOptions<T>['sorting'];
  }

  private parseFilter(
    filter: Record<string, Record<string, unknown>>,
  ): Filter<T> {
    const entries = Object.entries(filter).map(([field, conditions]) => {
      this.validateField(field);

      if (
        !conditions ||
        typeof conditions !== 'object' ||
        Array.isArray(conditions)
      ) {
        throw new BadRequestException(
          `Invalid filter conditions for field: ${field}`,
        );
      }

      const parser = this.getParser(field);

      const parsedConditions = Object.entries(conditions).flatMap(
        ([operator, value]) => {
          this.validateOperator(operator);

          return this.parseConditions(
            operator as FilterOperator,
            value,
            parser,
          );
        },
      );

      return [field, parsedConditions] as const;
    });

    return Object.fromEntries(entries) as Filter<T>;
  }

  private parseConditions<V>(
    operator: FilterOperator,
    value: unknown,
    parser: QueryValueParser<V>,
  ): FilterCondition<V>[] {
    if (operator === 'in') {
      return [
        {
          operator,
          value: this.parseInValue(value, parser),
        },
      ];
    }

    const values = Array.isArray(value) ? value : [value];

    return values.map((item) => ({
      operator,
      value: this.parseValue(item, parser),
    }));
  }

  private parseInValue<V>(value: unknown, parser: QueryValueParser<V>): V[] {
    const values = Array.isArray(value) ? value : [value];

    return values.flatMap((item) =>
      this.toStringValue(item)
        .split(',')
        .map((value) => parser(value)),
    );
  }

  private parseValue<V>(value: unknown, parser: QueryValueParser<V>): V {
    return parser(this.toStringValue(value));
  }

  private validateField(field: string): void {
    if (!(field in this.fieldConfig)) {
      throw new BadRequestException(`Invalid query field: ${field}`);
    }
  }

  private validateOperator(operator: string): void {
    if (!FILTER_OPERATORS.includes(operator as FilterOperator)) {
      throw new BadRequestException(`Invalid filter operator: ${operator}`);
    }
  }

  private getParser(field: string): QueryValueParser<unknown> {
    const parser = this.fieldConfig[field as keyof T];

    if (!parser) {
      throw new BadRequestException(
        `No value parser configured for field: ${field}`,
      );
    }

    return parser as QueryValueParser<unknown>;
  }

  private toStringValue(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Query parameter value must be a string');
    }

    return value;
  }
}
