import { Observable } from 'rxjs';
import { ActiveState, EntityState, HashMap, ID } from '../api/types';

export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

/** Check if a value is an object */
export function isObject(value: any) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isPlainObject(value: any): value is object {
  return isDefined(value) && value.constructor.name === 'Object';
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value);
}

export function toBoolean(value: any): boolean {
  return value != null && `${value}` !== 'false';
}

export function isUndefined(value: any): value is undefined {
  return value === undefined;
}

export function isNil(v) {
  return v === null || v === undefined;
}

/**
 * Check if entity exists
 */
export function entityExists<E>(id: ID, entities: HashMap<E>) {
  return entities.hasOwnProperty(id);
}

/**
 * Observable that emits empty value and complete
 */
export function noop<T>(): Observable<T> {
  return new Observable(observer => {
    observer.next();
    observer.complete();
  });
}

export function isObservable(value) {
  return toBoolean(value) && isFunction(value.subscribe);
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isDefined(val) {
  return val !== null && val !== undefined;
}

/**
 * Remove active upon deletion if not exist
 */
export function resetActive<E>(state: EntityState<E>) {
  return isActiveState(state) && entityExists(state.active, state.entities) === false;
}

/**
 * Remove active upon deletion if not exist
 */
export function getActives(currentActivesIds: ID[], newIds: ID[]) {
  const filtered = currentActivesIds.filter(id => newIds.indexOf(id) > -1);
  /** Return the same reference if nothing has changed */
  if (filtered.length === currentActivesIds.length) {
    return currentActivesIds;
  }

  return filtered;
}

/**
 *
 * remove
 * Check if the store supports active entity
 */
export function isActiveState<E>(state: EntityState<E>) {
  return (state as ActiveState).hasOwnProperty('active');
}

/**
 * setValue(state, 'todos.ui', { filter: {}})
 */
export const setValue = (obj: any, prop: string, val: any) => {
  const split = prop.split('.');

  if (split.length === 1) return val;

  obj = { ...obj };

  const lastIndex = split.length - 2;
  const removeStoreName = prop.split('.').slice(1);

  removeStoreName.reduce((acc, part, index) => {
    if (index === lastIndex) {
      acc[part] = val;
    } else {
      acc[part] = { ...acc[part] };
    }

    return acc && acc[part];
  }, obj);

  return obj;
};

/**
 * getValue(state, 'todos.ui')
 */
export const getValue = (obj: any, prop: string) => {
  /** return the whole state  */
  if (prop.split('.').length === 1) {
    return obj;
  }
  const removeStoreName = prop
    .split('.')
    .slice(1)
    .join('.');
  return removeStoreName.split('.').reduce((acc: any, part: string) => acc && acc[part], obj);
};

export const DEFAULT_ID_KEY = 'id';
