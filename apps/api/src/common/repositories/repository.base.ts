import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { BaseEntity } from '../entities/base.entity.js';
import { QueryOptions } from '../query/query-options.js';
import { FilterMapper } from '../query/filter.mapper.js';
import { Filter } from '../query/filter.js';
import { QueryResult } from '../query/query-result.js';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly filterMapper: FilterMapper<T>,
  ) {}

  async getAll(options: QueryOptions<T> = {}): Promise<QueryResult<T>> {
    const {
      pagination = {
        page: 1,
        limit: 20,
      },
      filter,
      sorting,
    } = options;

    const [data, total] = await this.repository.findAndCount({
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      where: filter ? this.filterMapper.toWhere(filter) : undefined,
      order: sorting as FindOptionsOrder<T>,
    });

    const pages = Math.ceil(total / pagination.limit);

    return {
      data,
      page: pagination.page,
      limit: pagination.limit,
      hasNext: pagination.page < pages,
      pages,
      total,
    };
  }

  async getById(
    id: string,
    options: Omit<QueryOptions<T>, 'pagination' | 'sorting'> = {},
  ): Promise<T | null> {
    const { filter } = options;

    const where = filter
      ? {
          ...this.filterMapper.toWhere(filter),
          id,
        }
      : {
          id,
        };

    return this.repository.findOne({
      where: where as FindOptionsWhere<T>,
    });
  }

  async insert(entity: Omit<T, keyof BaseEntity>): Promise<T> {
    const entityInstance = this.repository.create(entity as DeepPartial<T>);

    return this.repository.save(entityInstance);
  }

  async insertMany(entities: Omit<T, keyof BaseEntity>[]): Promise<T[]> {
    const entityInstances = entities.map((entity) =>
      this.repository.create(entity as DeepPartial<T>),
    );

    return this.repository.save(entityInstances);
  }
  async update(
    filter: Filter<T>,
    data: Partial<Omit<T, keyof BaseEntity>>,
  ): Promise<T | null> {
    const entity = await this.repository.findOne({
      where: this.filterMapper.toWhere(filter),
    });

    if (!entity) {
      return null;
    }

    Object.assign(entity, data);

    return this.repository.save(entity);
  }

  async updateMany(
    filter: Filter<T>,
    data: Partial<Omit<T, keyof BaseEntity>>,
  ): Promise<T[]> {
    const entities = await this.repository.find({
      where: this.filterMapper.toWhere(filter),
    });

    if (entities.length === 0) {
      return [];
    }

    entities.forEach((entity) => {
      Object.assign(entity, data);
    });

    return this.repository.save(entities);
  }

  async delete(filter: Filter<T>): Promise<T | null> {
    const entity = await this.repository.findOne({
      where: this.filterMapper.toWhere(filter),
    });

    if (!entity) {
      return null;
    }

    return this.repository.remove(entity);
  }

  async deleteMany(filter: Filter<T>): Promise<T[]> {
    const entities = await this.repository.find({
      where: this.filterMapper.toWhere(filter),
    });

    return this.repository.remove(entities);
  }
}
