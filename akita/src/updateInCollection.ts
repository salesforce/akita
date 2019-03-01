import { ArrayProperties, IDS, ItemPredicate } from './types';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { coerceArray } from './coerceArray';
import { isFunction } from './isFunction';

/**
 * Update item in a collection
 *
 * @example
 *
 * store.update(1, updateInCollection<Article, Comment>('comments', 1, { name: 'newName' }))
 * store.update(1, updateInCollection<Article, Comment>('comments', 1, { name: 'newName' }, '_id'))
 * store.update(1, updateInCollection<Article, Comment>('comments', item => item.completed === true, { name: 'newName' }))
 */
export function updateInCollection<Entity, CollectionType = any>(key: ArrayProperties<Entity>, predicateOrIds: ItemPredicate<CollectionType>, obj: Partial<CollectionType>, idKey?: string);
export function updateInCollection<Entity, CollectionType = any>(key: ArrayProperties<Entity>, predicateOrIds: IDS, obj: Partial<CollectionType>, idKey?: string);
export function updateInCollection<Entity, CollectionType = any>(
  key: ArrayProperties<Entity>,
  predicateOrIds: IDS | ItemPredicate<CollectionType>,
  obj: Partial<CollectionType>,
  idKey = DEFAULT_ID_KEY
) {
  let condition: ItemPredicate<CollectionType>;

  if (isFunction(predicateOrIds)) {
    condition = predicateOrIds;
  } else {
    const ids = coerceArray(predicateOrIds);
    condition = item => ids.includes(item[idKey]) === true;
  }

  return entity => {
    return {
      [key]: entity[key].map(entity => {
        if (condition(entity) === true) {
          return {
            ...entity,
            ...obj
          };
        }

        return entity;
      })
    };
  };
}
