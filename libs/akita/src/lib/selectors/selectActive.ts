import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { hasActiveState } from '../activeState';
import { EntityState, getEntityType, getIDType, ID } from '../types';
import { remember } from './utils/rxjs/remember';

export function selectActive<S extends EntityState<EntityType, IdType>, EntityType = getEntityType<S>, IdType extends ID = getIDType<S>>(): OperatorFunction<S, IdType | IdType[] | undefined> {
  return (source: Observable<S>) =>
    source.pipe(
      map((state) => {
        if (hasActiveState(state as any)) {
          return state.active;
        }
        return undefined;
      }),
      remember()
    );
}
