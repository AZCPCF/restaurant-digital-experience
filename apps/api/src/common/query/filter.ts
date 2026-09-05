export type Filter<T> = {
  [K in keyof T]?: FilterCondition<T[K]>[];
};

export type FilterCondition<V> =
  | {
      operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like';
      value: V;
    }
  | {
      operator: 'in';
      value: V[];
    };
