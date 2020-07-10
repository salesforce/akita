import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityState, getEntityType, getIDType } from '../types';

/**
 *
 * @example
 *
 * Selects an entity from the store
 *
 *  query.state$.pipe(selectEntity(2)).subscribe(v => {})
 */
export function selectEntity<S extends EntityState, EntityType = getEntityType<S>, IdType = getIDType<S>>(id: IdType) {
  return (source: Observable<S>) => source.pipe(map((state) => state.entities[id as any] as EntityType));
}

/**
 *
 * @example
 *
 * Selects entitites from the store
 *
 *  query.state$.pipe(selectEntity([1, 2, 3])).subscribe(entities => {})
 */
export function selectEntities<S extends EntityState, EntityType = getEntityType<S>, IdType = getIDType<S>>(ids: IdType[]) {
  // ...
}

export function selectActive<S extends EntityState, EntityType = getEntityType<S>, IdType = getIDType<S>>() {
  // ...
}

// Try to optimize this function
export function selectEntityByFn<S extends EntityState, EntityType = getEntityType<S>>(predicate: (entity: EntityType) => boolean) {
  return (source: Observable<S>) => source.pipe(map((state) => state.ids.filter((id) => predicate(state.entities[id])).map((id) => state.entities[id] as EntityType[])));
}
