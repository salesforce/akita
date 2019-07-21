import { ID } from './types';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { arrayAdd } from './arrayAdd';
import { arrayUpdate } from './arrayUpdate';
import { isObject } from './isObject';

/**
 * Upsert item in a collection
 *
 * @example
 *
 *
 * store.update(1, entity => ({
 *   comments: arrayUpsert(entity.comments, 1, { name: 'newComment' })
 * }))
 */
export function arrayUpsert<Root extends any[]>(arr: Root, id: ID, obj: Partial<Root[0]>, idKey = DEFAULT_ID_KEY): Root[0][] {
  const entityExists = arr.some(entity => (isObject(entity) ? entity[idKey] === id : entity === id));
  if (entityExists) {
    return arrayUpdate(arr, id, obj);
  } else {
    return arrayAdd(arr, isObject(obj) ? { ...obj, [idKey]: id } : obj);
  }
}
