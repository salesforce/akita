import { isDefined, isObject, isString } from '../../internal/utils';
import { AkitaFilter } from './akita-filters-store';

/**
 * Helper function to do a default filter
 */
export function defaultFilter<E = any>( value: E, index: number, array: E[], filter: AkitaFilter<E> ): boolean {
  if( isObject(value) && isString(filter.value) ) {
    return searchFilter(filter.value, value);
  }
  return isDefined(filter.value) ? filter.value === value : !!value;
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
  return isString(inObj[inKey]) && inObj[inKey].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase());
}
