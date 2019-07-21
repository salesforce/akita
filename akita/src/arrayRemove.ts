import { ArrayProperties, IDS, ItemPredicate } from './types';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { coerceArray } from './coerceArray';
import { isObject } from './isObject';
import { isFunction } from './isFunction';
import { not } from './not';

/**
 * Remove item from collection
 *
 * @example
 *
 *
 * store.update(state => ({
 *   names: arrayRemove(state.names, ['one', 'second'])
 * }))
 */
export function arrayRemove<Root extends any[], Entity = Root[0]>(keyOrRoot: Root, identifier: IDS | ItemPredicate<Root[0]>, idKey?: string): Root[0][];
/**
 * @deprecated
 */
export function arrayRemove<Root, Entity = any>(keyOrRoot: ArrayProperties<Root>, identifier: IDS | ItemPredicate<Entity>, idKey?: string): (state: Root) => Root;
export function arrayRemove<Root, Entity = any>(keyOrRoot: ArrayProperties<Root> | Root, identifier: IDS | ItemPredicate<Entity>, idKey = DEFAULT_ID_KEY) {
  let identifiers;
  let filterFn;

  if (isFunction(identifier)) {
    filterFn = not(identifier);
  } else {
    identifiers = coerceArray(identifier as IDS);
    filterFn = current => {
      return identifiers.includes(isObject(current) ? current[idKey] : current) === false;
    };
  }

  if (Array.isArray(keyOrRoot)) {
    return keyOrRoot.filter(filterFn);
  }

  return state => {
    return {
      [keyOrRoot as string]: state[keyOrRoot].filter(filterFn)
    };
  };
}
