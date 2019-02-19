import { isFunction } from './isFunction';
import { isNil } from './isNil';

export type EntityIdKey<Entity> = string | ((entity: Entity) => any);

/**
 * @StoreConfig({
 *   idKey: '_id'
 * })
 *
 * @StoreConfig({
 *   idKey: entity => entity.someKey.id
 * })
 */
export function getEntityId<Entity>(idKey: EntityIdKey<Entity>, entity: Entity) {
  if (isFunction(idKey)) {
    return idKey(entity);
  }

  return entity[idKey];
}

export function entityIdKeyExist<Entity>(idKey: EntityIdKey<Entity>, entity: Entity) {
  if (isFunction(idKey)) {
    return isNil(idKey(entity)) === false;
  }

  return entity.hasOwnProperty(idKey) === true;
}
