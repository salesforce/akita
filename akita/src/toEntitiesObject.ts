// @internal
import { PreAddEntity } from './types';

export function toEntitiesObject<E>(entities: E[], idKey: string, preAddEntity: PreAddEntity<E>) {
  const acc = {};

  for (const entity of entities) {
    acc[entity[idKey]] = preAddEntity(entity);
  }

  return acc;
}
