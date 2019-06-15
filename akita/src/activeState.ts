import { ActiveState, EntityState, ID, IDS, MultiActiveState } from './types';
import { hasEntity } from './hasEntity';
import { isArray } from './isArray';

// @internal
export function hasActiveState<E>(state: EntityState<E>): state is EntityState<E> & (ActiveState | MultiActiveState) {
  return state.hasOwnProperty('active');
}

// @internal
export function isMultiActiveState(active: IDS): active is ID[] {
  return isArray(active);
}

// @internal
export function resolveActiveEntity<E>({ active, ids, entities }: EntityState<E> & (ActiveState | MultiActiveState)) {
  if (isMultiActiveState(active)) {
    return getExitingActives(active, ids);
  }

  if (hasEntity(entities, active) === false) {
    return null;
  }

  return active;
}

// @internal
export function getExitingActives(currentActivesIds: ID[], newIds: ID[]) {
  const filtered = currentActivesIds.filter(id => newIds.indexOf(id) > -1);
  /** Return the same reference if nothing has changed */
  if (filtered.length === currentActivesIds.length) {
    return currentActivesIds;
  }

  return filtered;
}
