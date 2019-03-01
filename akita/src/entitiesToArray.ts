import { EntityState, SelectOptions } from './types';
import { isFunction } from './isFunction';
import { compareValues } from './sort';
import { coerceArray } from './coerceArray';

// @internal
export function entitiesToArray<E, S extends EntityState>(state: S, options: SelectOptions<E>): E[] {
  let arr = [];
  const { ids, entities } = state;
  const { filterBy, limitTo, sortBy, sortByOrder } = options;

  for (let i = 0; i < ids.length; i++) {
    const entity = entities[ids[i]];
    if (!filterBy) {
      arr.push(entity);
      continue;
    }

    const toArray = coerceArray(filterBy);
    const allPass = toArray.every(fn => fn(entity, i));
    if (allPass) {
      arr.push(entity);
    }
  }

  if (sortBy) {
    let _sortBy: any = isFunction(sortBy) ? sortBy : compareValues(sortBy, sortByOrder);
    arr = arr.sort((a, b) => _sortBy(a, b, state));
  }

  const length = Math.min(limitTo || arr.length, arr.length);

  return length === arr.length ? arr : arr.slice(0, length);
}
