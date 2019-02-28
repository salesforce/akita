import { ArrayProperties } from './types';
import { coerceArray } from './coerceArray';

/**
 * Add item to a collection
 *
 * @example
 *
 * const comments = [...];
 * store.update(1, addToCollection<Article>('comments', comments))
 */
export function addToCollection<Entity, CollectionType = any>(key: ArrayProperties<Entity>, newEntity: CollectionType | CollectionType[]) {
  const newEntities = coerceArray(newEntity);

  return entity => {
    return { [key]: [...entity[key], ...newEntities] };
  };
}
