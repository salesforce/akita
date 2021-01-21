import { OrArray } from './types';
import { coerceArray } from './coerceArray';
import { AddEntitiesOptions } from './addEntities';

/**
 * Add item to a collection
 *
 * @example
 *
 *
 * store.update(state => ({
 *   comments: arrayAdd(state.comments, { id: 2 })
 * }))
 *
 */

export function arrayAdd<T extends any[], Entity = any>(arr: T, newEntity: OrArray<Entity>, options: AddEntitiesOptions = {}): T {
  const newEntities = coerceArray(newEntity);
  const toArr = arr || [];

  return options.prepend ? [...newEntities, ...toArr] : ([...toArr, ...newEntities] as any);
}
