import { ArrayProperties } from './types';
import { coerceArray } from './coerceArray';
import { AddEntitiesOptions } from './addEntities';

/**
 * Add item to a collection
 *
 * @example
 *
 * const comments = [...];
 * store.update(1, arrayAdd<Article>('comments', comments))
 *store.update(1, arrayAdd<Article>('comments', comments, { prepend: true }))
 *
 */
export function arrayAdd<Entity, CollectionType = any>(key: ArrayProperties<Entity>, newEntity: CollectionType | CollectionType[], options: AddEntitiesOptions = {}) {
  const newEntities = coerceArray(newEntity);

  return entity => {
    return { [key]: options.prepend ? [...newEntities, ...entity[key]] : [...entity[key], ...newEntities] };
  };
}
