import { IDS, ItemPredicate } from './types';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { coerceArray } from './coerceArray';
import { isFunction } from './isFunction';
import { isObject } from './isObject';

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
export function arrayUpdate<T extends any[], Entity = any>(arr: T, predicateOrIds: IDS | ItemPredicate<Entity>, obj: Partial<Entity>, idKey = DEFAULT_ID_KEY) {
  let condition: ItemPredicate<Entity>;

  if (isFunction(predicateOrIds)) {
    condition = predicateOrIds;
  } else {
    const ids = coerceArray(predicateOrIds);
    condition = (item) => ids.includes(isObject(item) ? item[idKey] : item) === true;
  }

  const updateFn = (state) =>
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

  return updateFn(arr);
}
