import { ActiveState, EntityState, hasEntity, ID, IDS, isArray, MultiActiveState } from '@datorama/akita';

export function hasActiveState<E>(state: EntityState<E>): state is EntityState<E> & (ActiveState | MultiActiveState) {
  return state.hasOwnProperty('active');
}

export function isMultiActiveState(active: IDS): active is ID[] {
  return isArray(active);
}

export function resolveActiveEntity<E>({ active, ids, entities }: EntityState<E> & (ActiveState | MultiActiveState)) {
  if (isMultiActiveState(active)) {
    return getExitingActives(active, ids);
  }

  if (hasEntity(entities, active) === false) {
    return null;
  }

  return active;
}

export function getExitingActives(currentActivesIds: ID[], newIds: ID[]) {
  const filtered = currentActivesIds.filter(id => newIds.indexOf(id) > -1);
  /** Return the same reference if nothing has changed */
  if (filtered.length === currentActivesIds.length) {
    return currentActivesIds;
  }

  return filtered;
}
