import { Observable } from 'rxjs';
import { ID } from '../api/types';

/** Wraps the provided value in an array, unless the provided _value is an array. */
export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

/** Check if a value is an object */
export function isObject(value: any) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isPlainObject(value) {
  return toBoolean(value) && value.constructor.name === 'Object';
}

export function isFunction(value): value is Function {
  return typeof value === 'function';
}

/**
 *
 */
export function toBoolean(value: any): boolean {
  return value != null && `${value}` !== 'false';
}

export function isUndefined(value) {
  return typeof value === 'undefined';
}

/**
 * Support IE
 */
export function getFunctionName(func) {
  if (func == null || typeof func !== 'function') {
    return '';
  }

  // check if we've the name property (ES6)
  if (func.hasOwnProperty('name')) {
    return func.name;
  }

  // ES5
  let funcName = func.toString();
  funcName = funcName.substr('function '.length);
  funcName = funcName.substr(0, funcName.indexOf('('));
  return funcName;
}

/**
 * Check if entity exists
 */
export function entityExists(id: ID, entities) {
  return id in entities;
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
