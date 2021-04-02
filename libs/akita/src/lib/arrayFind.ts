import { ID, IDS, ItemPredicate } from './types';
import { coerceArray } from './coerceArray';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { isArray } from './isArray';
import { isFunction } from './isFunction';
import { isEmpty } from './isEmpty';

// @internal
export function find<T>(collection: T[], idsOrPredicate: IDS | ItemPredicate, idKey: string) {
  const result = [];
  if (isFunction(idsOrPredicate)) {
    for (const entity of collection) {
      if (idsOrPredicate(entity) === true) {
        result.push(entity);
      }
    }
  } else {
    const toSet = coerceArray(idsOrPredicate).reduce((acc, current) => acc.add(current), new Set());

    for (const entity of collection) {
      if (toSet.has(entity[idKey])) {
        result.push(entity);
      }
    }
  }

  return result;
}

// @internal
export function distinctUntilArrayItemChanged<T>(): MonoTypeOperatorFunction<T[]> {
  return distinctUntilChanged((prevCollection: T[], currentCollection: T[]) => {
    if (prevCollection === currentCollection) {
      return true;
    }

    if (isArray(prevCollection) === false || isArray(currentCollection) === false) {
      return false;
    }

    if (isEmpty(prevCollection) && isEmpty(currentCollection)) {
      return true;
    }

    // if item is new in the current collection but not exist in the prev collection
    const hasNewItem = hasChange(currentCollection, prevCollection);

    if (hasNewItem) {
      return false;
    }

    const isOneOfItemReferenceChanged = hasChange(prevCollection, currentCollection);

    // return false means there is a change and we want to call next()
    return isOneOfItemReferenceChanged === false;
  });
}

// @internal
function hasChange<T>(first: T[], second: T[]) {
  const hasChange = second.some(currentItem => {
    const oldItem = first.find(prevItem => prevItem === currentItem);
    return oldItem === undefined;
  });

  return hasChange;
}

/**
 * Find items in a collection
 *
 * @example
 *
 *  selectEntity(1, 'comments').pipe(
 *   arrayFind(comment => comment.text = 'text')
 * )
 */
export function arrayFind<T>(ids: ItemPredicate<T>, idKey?: never): (source: Observable<T[]>) => Observable<T[]>;
/**
 * @example
 *
 * selectEntity(1, 'comments').pipe(
 *   arrayFind(3)
 * )
 */
export function arrayFind<T>(ids: ID, idKey?: string): (source: Observable<T[]>) => Observable<T>;
/**
 * @example
 *
 * selectEntity(1, 'comments').pipe(
 *   arrayFind([1, 2, 3])
 * )
 */
export function arrayFind<T>(ids: ID[], idKey?: string): (source: Observable<T[]>) => Observable<T[]>;
export function arrayFind<T>(idsOrPredicate: ID[] | ID | ItemPredicate<T>, idKey?: string): (source: Observable<T[]>) => Observable<T[] | T> {
  return function(source: Observable<T[]>) {
    return source.pipe(
      map((collection: T[] | undefined | null) => {
        // which means the user deleted the root entity or set the collection to nil
        if (isArray(collection) === false) {
          return collection;
        }
        return find(collection, idsOrPredicate, idKey || DEFAULT_ID_KEY);
      }),
      distinctUntilArrayItemChanged(),
      map(value => {
        if (isArray(value) === false) {
          return value;
        }

        if (isArray(idsOrPredicate) || isFunction(idsOrPredicate)) {
          return value;
        }

        return value[0];
      })
    );
  };
}
