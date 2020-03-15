import { ArrayProperties, OrArray } from './types';
import { coerceArray } from './coerceArray';
import { AddEntitiesOptions } from './addEntities';
import { isArray } from './isArray';

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
export function arrayAdd<Root extends any[], Entity = any>(keyOrRoot: Root, newEntity: OrArray<Root[0]>, options?: AddEntitiesOptions): Root[0][];
/**
 * @deprecated
 */
export function arrayAdd<Root, Entity = any>(keyOrRoot: ArrayProperties<Root>, newEntity: OrArray<Entity>, options?: AddEntitiesOptions): (state: Root) => Root;
export function arrayAdd<Root, Entity = any>(keyOrRoot: ArrayProperties<Root> | Root, newEntity: OrArray<Entity>, options: AddEntitiesOptions = {}) {
  const newEntities = coerceArray(newEntity);

  const addFn = state => (options.prepend ? [...newEntities, ...(state || [])] : [...(state || []), ...newEntities]);

  if (isArray(keyOrRoot)) {
    return addFn(keyOrRoot);
  }

  return state => {
    return {
      [keyOrRoot as ArrayProperties<Root>]: addFn(state[keyOrRoot])
    };
  };
}
