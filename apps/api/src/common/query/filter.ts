export type Filter<T> = {
  [t in keyof T]?: FilterCondition<T[t]>;
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
