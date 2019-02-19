import { Order } from './sort';

export type SortBy<E, S = any> = ((a: E, b: E, state?: S) => number) | keyof E;

export interface SortByOptions<E> {
  sortBy?: SortBy<E>;
  sortByOrder?: Order;
}

export interface QueryConfigOptions<E = any> extends SortByOptions<E> {}

export const queryConfigKey = 'akitaQueryConfig';

export function QueryConfig<E>(metadata: QueryConfigOptions<E>) {
  return function(constructor: Function) {
    constructor[queryConfigKey] = {};
    for (let i = 0, keys = Object.keys(metadata); i < keys.length; i++) {
      const key = keys[i];
      constructor[queryConfigKey][key] = metadata[key];
    }
  };
}
