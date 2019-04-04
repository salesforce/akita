import { IDS, ArrayProperties } from './types';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { coerceArray } from './coerceArray';

/**
 * Remove item from collection
 *
 * @example
 *
 * store.update(1, arrayRemove<Article>('comments', ids))
 * store.update(1, arrayRemove<Article>('comments', ids, '_id'))
 */
export function arrayRemove<Entity>(key: ArrayProperties<Entity>, entityId: IDS, idKey = DEFAULT_ID_KEY) {
  const ids = coerceArray(entityId);

  return entity => {
    return {
      [key]: entity[key].filter(current => ids.includes(current[idKey]) === false)
    };
  };
}
