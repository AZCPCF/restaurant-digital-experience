import { EqualOperator, FindOperator, Repository } from 'typeorm';

import { BaseEntity } from '../entities/base.entity.js';
import { BaseRepository } from './repository.base.js';
import { FilterMapper } from '../query/filter.mapper.js';

import { Mock } from 'vitest';

class TestEntity extends BaseEntity {
  name: string;
  age: number;
}

const entities = [
  {
    id: 'r-1',
    name: 'Test Restaurant',
    age: 25,
  },
  {
    id: 'r-2',
    name: 'Test Restaurant 2',
    age: 19,
  },

  {
    id: 'd-4',
    name: 'Test Restaurant 4',
    age: 22,
  },
];

const entity = entities[0];

class TestFilterMapper extends FilterMapper<TestEntity> {}

class TestRepository extends BaseRepository<TestEntity> {
  constructor(
    repository: Repository<TestEntity>,
    filterMapper: TestFilterMapper,
  ) {
    super(repository, filterMapper);
  }
}

describe('BaseRepository', () => {
  let repository: TestRepository;
  let mapper: TestFilterMapper;

  let repositoryMock: {
    create: Mock;
    save: Mock;
    findAndCount: Mock;
    findOne: Mock;
    find: Mock;
    remove: Mock;
  };

  beforeEach(() => {
    mapper = new TestFilterMapper();

    repositoryMock = {
      create: vitest.fn((data) => data),
      save: vitest.fn((entity) => entity),
      findAndCount: vitest.fn(),
      findOne: vitest.fn(),
      find: vitest.fn(),
      remove: vitest.fn(),
    };

    repository = new TestRepository(
      repositoryMock as unknown as Repository<TestEntity>,
      mapper,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(repositoryMock).toBeDefined();
    expect(mapper).toBeDefined();
  });

  describe('create', () => {
    it('should create and save an entity', async () => {
      repositoryMock.create.mockReturnValue(entity);
      repositoryMock.save.mockResolvedValue(entity);

      const result = await repository.create(entity);

      expect(repositoryMock.create).toHaveBeenCalledExactlyOnceWith(entity);
      expect(repositoryMock.save).toHaveBeenCalledExactlyOnceWith(entity);
      expect(result).toEqual(entity);
    });
  });

  describe('createMany', () => {
    it('should create and save multiple entities', async () => {
      repositoryMock.save.mockResolvedValue(entities);

      const result = await repository.createMany(entities);

      expect(repositoryMock.create).toHaveBeenCalledTimes(3);
      expect(repositoryMock.create).toHaveBeenNthCalledWith(1, entities[0]);
      expect(repositoryMock.create).toHaveBeenNthCalledWith(2, entities[1]);
      expect(repositoryMock.create).toHaveBeenNthCalledWith(3, entities[2]);

      expect(repositoryMock.save).toHaveBeenCalledExactlyOnceWith(entities);
      expect(result).toEqual(entities);
    });
  });

  describe('findAll', () => {
    it('should return the first page with default pagination', async () => {
      repositoryMock.findAndCount.mockResolvedValue([
        entities,
        entities.length,
      ]);

      const result = await repository.findAll();

      expect(repositoryMock.findAndCount).toHaveBeenCalledExactlyOnceWith({
        skip: 0,
        take: 20,
        where: undefined,
        order: undefined,
      });

      expect(result).toEqual({
        data: entities,
        page: 1,
        limit: 20,
        hasNext: false,
        pages: 1,
        total: entities.length,
      });
    });

    it('should return an empty page when requested page has no data', async () => {
      repositoryMock.findAndCount.mockResolvedValue([[], entities.length]);

      const result = await repository.findAll({
        pagination: {
          page: 2,
          limit: 10,
        },
      });

      expect(repositoryMock.findAndCount).toHaveBeenCalledExactlyOnceWith({
        skip: 10,
        take: 10,
        where: undefined,
        order: undefined,
      });

      expect(result).toEqual({
        data: [],
        page: 2,
        limit: 10,
        hasNext: false,
        pages: 1,
        total: entities.length,
      });
    });

    it('should apply filter', async () => {
      const data = entities.filter((entity) => entity.age > 19);

      repositoryMock.findAndCount.mockResolvedValue([data, data.length]);

      const result = await repository.findAll({
        filter: {
          age: {
            operator: 'gt',
            value: 19,
          },
        },
      });

      expect(repositoryMock.findAndCount).toHaveBeenCalledExactlyOnceWith({
        skip: 0,
        take: 20,
        where: {
          age: new FindOperator('moreThan', 19),
        },
        order: undefined,
      });

      expect(result).toEqual({
        data,
        page: 1,
        limit: 20,
        hasNext: false,
        pages: 1,
        total: data.length,
      });
    });

    it('should apply sorting', async () => {
      const data = [entities[1], entities[0]];

      repositoryMock.findAndCount.mockResolvedValue([data, data.length]);

      const result = await repository.findAll({
        sorting: {
          age: 'ASC',
          name: 'DESC',
        },
      });

      expect(repositoryMock.findAndCount).toHaveBeenCalledExactlyOnceWith({
        skip: 0,
        take: 20,
        where: undefined,
        order: {
          age: 'ASC',
          name: 'DESC',
        },
      });

      expect(result).toEqual({
        data,
        page: 1,
        limit: 20,
        hasNext: false,
        pages: 1,
        total: data.length,
      });
    });

    it('should indicate that there is a next page', async () => {
      repositoryMock.findAndCount.mockResolvedValue([entities, 25]);

      const result = await repository.findAll({
        pagination: {
          page: 2,
          limit: 10,
        },
      });

      expect(repositoryMock.findAndCount).toHaveBeenCalledExactlyOnceWith({
        skip: 10,
        take: 10,
        where: undefined,
        order: undefined,
      });

      expect(result).toEqual({
        data: entities,
        page: 2,
        limit: 10,
        hasNext: true,
        pages: 3,
        total: 25,
      });
    });
  });

  describe('findOne', () => {
    it('should find an entity by id', async () => {
      repositoryMock.findOne.mockResolvedValue(entity);

      const result = await repository.findOne('r-1');

      expect(repositoryMock.findOne).toHaveBeenCalledExactlyOnceWith({
        where: {
          id: 'r-1',
        },
      });

      expect(result).toEqual(entity);
    });

    it('should find an entity by id and filter', async () => {
      repositoryMock.findOne.mockResolvedValue(entity);

      const result = await repository.findOne('r-1', {
        filter: {
          age: {
            operator: 'eq',
            value: 25,
          },
        },
      });

      expect(repositoryMock.findOne).toHaveBeenCalledExactlyOnceWith({
        where: {
          age: new EqualOperator(25),
          id: 'r-1',
        },
      });

      expect(result).toEqual(entity);
    });

    it('should return null when entity is not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      const result = await repository.findOne('unknown-id');

      expect(repositoryMock.findOne).toHaveBeenCalledExactlyOnceWith({
        where: {
          id: 'unknown-id',
        },
      });

      expect(result).toBeNull();
    });
  });
  describe('update', () => {
    it('should update an entity', async () => {
      const data = { ...entities[0] };

      repositoryMock.findOne.mockResolvedValue(data);

      repositoryMock.save.mockResolvedValue({
        ...data,
        name: 'test',
      });

      const result = await repository.update(
        {
          id: { operator: 'eq', value: data.id },
        },
        { name: 'test' },
      );

      expect(repositoryMock.findOne).toHaveBeenCalledExactlyOnceWith({
        where: { id: new EqualOperator(data.id) },
      });

      expect(repositoryMock.save).toHaveBeenCalledExactlyOnceWith({
        ...data,
        name: 'test',
      });

      expect(result).toEqual({
        ...data,
        name: 'test',
      });
    });
    it('should return null when entity does not exist', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      const result = await repository.update(
        {
          id: { operator: 'eq', value: 'NULL' },
        },
        { name: 'test' },
      );

      expect(repositoryMock.findOne).toHaveBeenCalledExactlyOnceWith({
        where: { id: new EqualOperator('NULL') },
      });

      expect(repositoryMock.save).toHaveBeenCalledTimes(0);

      expect(result).toBeNull();
    });
  });
  describe('updateMany', () => {
    it('should update multiple entities', async () => {
      const data = entities
        .filter((_entity, i) => i < 2)
        .map((entity) => ({ ...entity }));
      repositoryMock.find.mockResolvedValue(data);
      repositoryMock.save.mockResolvedValue([
        {
          ...data[0],
          name: 'UPDATED',
        },
        {
          ...data[1],
          name: 'UPDATED',
        },
      ]);

      const result = await repository.updateMany(
        {
          id: { operator: 'like', value: 'r' },
        },
        { name: 'UPDATED' },
      );
      expect(repositoryMock.find).toHaveBeenCalledExactlyOnceWith({
        where: {
          id: new FindOperator('like', 'r'),
        },
      });

      expect(repositoryMock.save).toHaveBeenCalledExactlyOnceWith([
        {
          ...data[0],
          name: 'UPDATED',
        },
        {
          ...data[1],
          name: 'UPDATED',
        },
      ]);
      expect(result).toEqual([
        {
          ...data[0],
          name: 'UPDATED',
        },
        {
          ...data[1],
          name: 'UPDATED',
        },
      ]);
    });

    it('should return empty array when no entities found', async () => {
      repositoryMock.find.mockResolvedValue([]);

      const result = await repository.updateMany(
        {
          id: { operator: 'eq', value: 'EMPTY' },
        },
        { name: 'NOT_UPDATED' },
      );

      expect(repositoryMock.find).toHaveBeenCalledExactlyOnceWith({
        where: { id: new EqualOperator('EMPTY') },
      });
      expect(repositoryMock.save).toHaveBeenCalledTimes(0);

      expect(result).toEqual([]);
    });
  });
  describe('remove', () => {
    it('should remove an entity', async () => {
      const data = { ...entities[0] };

      repositoryMock.findOne.mockResolvedValue(data);
      repositoryMock.remove.mockResolvedValue(data);

      const result = await repository.remove({
        id: { operator: 'eq', value: 'r-1' },
      });

      expect(repositoryMock.findOne).toHaveBeenCalledExactlyOnceWith({
        where: { id: new EqualOperator('r-1') },
      });

      expect(repositoryMock.remove).toHaveBeenCalledExactlyOnceWith(data);

      expect(result).toEqual(data);
    });

    it('test 2', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      const result = await repository.remove({
        id: { operator: 'eq', value: 'NULL' },
      });

      expect(repositoryMock.findOne).toHaveBeenCalledExactlyOnceWith({
        where: { id: new EqualOperator('NULL') },
      });

      expect(repositoryMock.remove).toHaveBeenCalledTimes(0);

      expect(result).toEqual(null);
    });
  });

  describe('removeMany', () => {
    it('should remove multiple entities', async () => {
      const data = entities
        .filter((_entity, i) => i < 2)
        .map((entity) => ({ ...entity }));

      repositoryMock.find.mockResolvedValue(data);
      repositoryMock.remove.mockResolvedValue(data);

      const result = await repository.removeMany({
        id: { operator: 'like', value: 'r' },
      });

      expect(repositoryMock.find).toHaveBeenCalledExactlyOnceWith({
        where: {
          id: new FindOperator('like', 'r'),
        },
      });

      expect(repositoryMock.remove).toHaveBeenCalledExactlyOnceWith(data);

      expect(result).toEqual(data);
    });

    it('should remove an empty array when no entities are found', async () => {
      repositoryMock.find.mockResolvedValue([]);
      repositoryMock.remove.mockResolvedValue([]);

      const result = await repository.removeMany({
        id: { operator: 'eq', value: 'EMPTY' },
      });

      expect(repositoryMock.find).toHaveBeenCalledExactlyOnceWith({
        where: {
          id: new EqualOperator('EMPTY'),
        },
      });

      expect(repositoryMock.remove).toHaveBeenCalledExactlyOnceWith([]);

      expect(result).toEqual([]);
    });
  });
});
