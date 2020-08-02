import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityState, getEntityType, getIDType, ID } from '../types';
import { remember } from './utils/rxjs/remember';

/**
 *
 * Select many entities from the store by id.
 *
 * @example
 *  store.state$.pipe(selectMany([1, 2, 3]))
 */
export function selectMany<S extends EntityState<EntityType, IdType>, EntityType = getEntityType<S>, IdType extends ID = getIDType<S>>(ids: IdType[]) {
  return (source: Observable<S>) =>
    source.pipe(
      map((state) => ids.map((id) => state.entities[id])),
      remember()
    );
}
