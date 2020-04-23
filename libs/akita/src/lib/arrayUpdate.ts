import { coerceArray } from './coerceArray';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { isArray } from './isArray';
import { isFunction } from './isFunction';
import { isObject } from './isObject';
import { ArrayProperties, IDS, ItemPredicate } from './types';

/**
 * Update item in a collection
 *
 * @example
 *
 *
 * store.update(1, entity => ({
 *   comments: arrayUpdate(entity.comments, 1, { name: 'newComment' })
 * }))
 */
export function arrayUpdate<Root extends any[], Entity = any>(keyOrRoot: Root, predicateOrIds: IDS | ItemPredicate<Root[0]>, obj: Partial<Root[0]>, idKey?: string): Root[0][];
/**
 * @deprecated
 */
export function arrayUpdate<Root, Entity = any>(keyOrRoot: ArrayProperties<Root>, predicateOrIds: IDS | ItemPredicate<Entity>, obj: Partial<Entity>, idKey?: string): (state: Root) => Root;
export function arrayUpdate<Root, Entity = any>(keyOrRoot: ArrayProperties<Root> | Root, predicateOrIds: IDS | ItemPredicate<Entity>, obj: Partial<Entity>, idKey = DEFAULT_ID_KEY): any {
  let condition: ItemPredicate<Entity>;

  if (isFunction(predicateOrIds)) {
    condition = predicateOrIds;
  } else {
    const ids = coerceArray(predicateOrIds);
    condition = (item): boolean => ids.includes(isObject(item) ? item[idKey] : item) === true;
  }

  const updateFn = (state): any =>
    state.map((entity) => {
      if (condition(entity) === true) {
        return isObject(entity)
          ? {
              ...entity,
              ...obj,
            }
          : obj;
      }

      return entity;
    });

  if (isArray(keyOrRoot)) {
    return updateFn(keyOrRoot);
  }

  return (root): any => ({
    [keyOrRoot as string]: updateFn(root[keyOrRoot]),
  });
}
