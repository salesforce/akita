import { hasActiveState } from '@datorama/akita';
import { Observable, OperatorFunction } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { EntityState, getEntityType, getIDType, ID } from '../types';

function isEqualByKeys(a?: Object, b?: Object): boolean {
  // Test if a and b are equal by identity
  if (a === b) {
    return true;
  }

  // Test whether a or b is not an object type, then at least one is a primitive value
  // and not equal to the other, otherwise the previous test would be true.
  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  // Test if both are arrays or not, otherwise an empty object ({}) would be equal
  // to an empty array ([]).
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const aKeys = Object.keys(a) as (keyof typeof a)[];
  const bKeys = Object.keys(b) as (keyof typeof b)[];

  // If a new property or element (for an array) was added, then they are not equal.
  if (aKeys.length !== bKeys.length) {
    return false;
  }

  // Both have the same count of keys, test that all values are equal.
  return aKeys.every((aKey) => isEqualByKeys(a[aKey], b[aKey]));
}

/**
 * Compare current and previous emitted values by its content.
 */
function remember<T>() {
  let prev: T | undefined;
  return (source: Observable<T>) =>
    source.pipe(
      filter((curr) => !isEqualByKeys(prev, curr)),
      tap((curr) => (prev = curr))
    );
}

function memomize<T extends (...args: any[]) => R, R>(fn: T): T {
  let prev: any;
  let last: any;

  return function () {
    if (isEqualByKeys(prev, arguments)) {
      return last;
    }

    prev = arguments;
    last = fn.apply(undefined, (arguments as unknown) as any[]);

    return last;
  } as T;
}

/**
 *
 *
 * Selects an entity from the store by id
 *
 * @example
 *  store.state$.pipe(selectOne(2)).subscribe(v => {})
 */
export function selectOne<S extends EntityState<EntityType, IdType>, EntityType = getEntityType<S>, IdType extends ID = getIDType<S>>(id: IdType) {
  return (source: Observable<S>) => source.pipe(map((state) => state.entities[id]));
}

/**
 *
 * Selects many entities from the store by id.
 *
 * @example
 *  store.state$.pipe(selectMany([1, 2, 3])).subscribe(entities => {})
 */
export function selectMany<S extends EntityState<EntityType, IdType>, EntityType = getEntityType<S>, IdType extends ID = getIDType<S>>(ids: IdType[]) {
  return (source: Observable<S>) => source.pipe(map((state) => ids.map((id) => state.entities[id])));
}

/**
 *
 * Selects many entities from the store by a predicate function.
 *
 * @example
 *  store.state$.pipe(selectManyFn(entity => entity.enabled)).subscribe(entities => {})
 */
export function selectManyFn<S extends EntityState<EntityType, IdType>, EntityType = getEntityType<S>, IdType extends ID = getIDType<S>>(predicate: (entity: EntityType) => boolean) {
  return (source: Observable<S>) =>
    source.pipe(
      map((state) => state.ids.filter((id) => predicate(state.entities[id])).map((id) => state.entities[id])),
      remember()
    );
}

export function selectActive<S extends EntityState<EntityType, IdType>, EntityType = getEntityType<S>, IdType extends ID = getIDType<S>>(): OperatorFunction<S, IdType | IdType[] | undefined> {
  return (source: Observable<S>) =>
    source.pipe(
      map((state) => {
        if (hasActiveState<S, EntityType, IdType>(state)) {
          return state.active;
        }
        return undefined;
      })
    );
}
