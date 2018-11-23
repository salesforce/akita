import { EntityState, ID } from '../../api/types';
import { guid } from '../../api/store-utils';
import { StoreConfig } from '../../api/store-config';
import { EntityStore } from '../../api/entity-store';
import { SortByOptions } from '../../api/query-config';
import { capitalize, isObject } from '../../internal/utils';


/**
 * Helper function to do do a default filter
 * @param searchKey
 * @param inObj
 */
export function defaultFilter(searchValue: any, inElement: any) {
  if (isObject(inElement)) {
    return searchFilter(searchValue, inElement);
  }
  return searchValue === inElement;
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

export type Filter = {
  id: ID;
  /** A corresponding name for display the filter, by default, it will be ${id): ${value}  */
  name?: string;
  /** set the order for filter, by default, it is 10 */
  order?: number;
  /** The filter value, this will be used to compute name, or getting the current value, to initiate your form */
  value?: any;
  /** If you want to have filter that is not displayed on the list */
  hide?: boolean;
  /** The function to apply filters, by default use defaultFilter helpers, that will search the value in the object */
  function: (value: any, index: number, array: any[]) => any;
};
/**
 * A factory function that creates Wish
 */
export function createFilter(filterParams: Partial<Filter>) {
  const id: ID = filterParams.id ? filterParams.id : guid();
  const computedName: string = filterParams.value && filterParams.id ? capitalize(filterParams.id.toString()) + ': ' + filterParams.value.toString() : undefined;

  if (!filterParams.function && filterParams.value) {
    /** use default function, if not provided */
    filterParams.function = (value: any, index: number, array: any[]) => defaultFilter(filterParams.value, value);
  }

  return { order: 10, name: computedName, hide: false, ...filterParams, id } as Filter;
}

export interface FiltersState extends EntityState<Filter> {
  sort: SortByOptions<any>;
}

@StoreConfig({ name: 'filters' })
export class FiltersStore extends EntityStore<FiltersState, Filter> {
  constructor() {
    super();
  }
}
