import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityState, getEntityType, getIDType, ID } from '../types';
import { remember } from './utils/rxjs/remember';

export function selectAllIds<S extends EntityState<EntityType, IdType>, EntityType = getEntityType<S>, IdType extends ID = getIDType<S>>(predicate: (entity: EntityType) => boolean) {
  return (source: Observable<S>) =>
    source.pipe(
      map((state) => state.ids),
      remember()
    );
}
