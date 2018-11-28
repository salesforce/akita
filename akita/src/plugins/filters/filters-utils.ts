import { isDefined, isObject, isString } from '../../internal/utils';
import { Filter } from './filters-store';

/**
 * Helper function to do a default filter
 */
export function defaultFilter<E = any>( inElement: E, index: number, array: E[], filter: Filter<E> ): boolean {
  if( isObject(inElement) && isDefined(filter.value) && isString(filter.value) ) {
    return searchFilter(filter.value, inElement);
  }
  return isDefined(filter.value) ? filter.value === inElement : !!inElement;
}

/**
 * Helper function to do search on all string element
 */
export function searchFilter( searchKey: string, inObj: Object ): boolean {
  return Object.keys(inObj).some(function( key ) {
    return isString(inObj[key]) && inObj[key].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase());
  });
}

/**
 * Helper function to do search in one key of an object
 */
export function searchFilterIn( searchKey: string, inObj: Object, inKey: string ): boolean {
  return typeof inObj[inKey] === 'string' && inObj[inKey].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase());
}
