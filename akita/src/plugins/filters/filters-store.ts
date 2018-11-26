import { EntityState, ID } from '../../api/types';
import { guid } from '../../api/store-utils';
import { StoreConfig } from '../../api/store-config';
import { EntityStore } from '../../api/entity-store';
import { SortByOptions } from '../../api/query-config';
import { capitalize, isObject } from '../../internal/utils';
import { defaultFilter } from './filters-utils';




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
  function: (value: any, index: number, array: any[], filter: Filter) => any;
};
/**
 * A factory function that creates Wish
 */
export function createFilter(filterParams: Partial<Filter>) {
  const id: ID = filterParams.id ? filterParams.id : guid();
  const computedName: string = filterParams.value && filterParams.id ? capitalize(filterParams.id.toString()) + ': ' + filterParams.value.toString() : undefined;

  if (!filterParams.function && filterParams.value) {
    /** use default function, if not provided */
    filterParams.function = (value: any, index: number, array: any[], filter: Filter) => defaultFilter;
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
