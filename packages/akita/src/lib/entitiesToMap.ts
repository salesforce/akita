import { EntityState } from './types';
import { isNil } from './isNil';
import { coerceArray } from './coerceArray';

// @internal
export function entitiesToMap<S extends EntityState<E>, E>(state: S, options) {
  const map = {};
  const { filterBy, limitTo } = options;
  const { ids, entities } = state;

  if (!filterBy && !limitTo) {
    return entities;
  }
  const hasLimit = isNil(limitTo) === false;

  if (filterBy && hasLimit) {
    let count = 0;
    for (let i = 0, length = ids.length; i < length; i++) {
      if (count === limitTo) break;
      const id = ids[i];
      const entity = entities[id];
      const allPass = coerceArray(filterBy).every(fn => fn(entity, i));
      if (allPass) {
        map[id] = entity;
        count++;
      }
    }
  } else {
    const finalLength = Math.min(limitTo || ids.length, ids.length);

    for (let i = 0; i < finalLength; i++) {
      const id = ids[i];
      const entity = entities[id];

      if (!filterBy) {
        map[id] = entity;
        continue;
      }

      const allPass = coerceArray(filterBy).every(fn => fn(entity, i));
      if (allPass) {
        map[id] = entity;
      }
    }
  }

  return map;
}
