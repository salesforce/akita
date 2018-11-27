import { isDefined, isObject } from '../../internal/utils';
import { Filter } from './filters-store';

/**
 * Helper function to do a default filter
 * @param searchKey
 * @param inObj
 */
export function defaultFilter<E = any>(inElement: E, index: number, array: E[], filter: Filter) {
  if (isObject(inElement) && isDefined(filter.value)) {
    return searchFilter(filter.value, inElement);
  }
  return isDefined(filter.value) ? filter.value === inElement : inElement;
}

/**
 * Helper function to do search on all string element
 * @param searchKey
 * @param inObj
 */
export function searchFilter(searchKey: string, inObj: Object) {
  return Object.keys(inObj).some(function(key) {
    return typeof inObj[key] === 'string' && inObj[key].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase());
  });
}

/**
 * Helper function to do search in one key of an object
 * @param searchKey
 * @param inObj
 */
export function searchFilterIn(searchKey: string, inObj: Object, inKey: string) {
  return typeof inObj[inKey] === 'string' && inObj[inKey].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase());
}
