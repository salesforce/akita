import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityState, getEntityType, getIDType, ID } from '../types';
import { remember } from './utils/rxjs/remember';

/**
 *
 * Select an entity from the store by a predicate function.
 *
 * @example
 *  store.state$.pipe(selectOneByFn(entity => enabled.id === 2 && entity.enabled))
 */
export function selectOneByFn<S extends EntityState<EntityType, IdType>, EntityType = getEntityType<S>, IdType extends ID = getIDType<S>>(predicate: (entity: EntityType) => boolean) {
  return (source: Observable<S>) =>
    source.pipe(
      map((state) => {
        const id = state.ids.find((id) => predicate(state.entities[id]));
        return id ? state.entities[id] : undefined;
      }),
      remember()
    );
}
