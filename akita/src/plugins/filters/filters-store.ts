import { EntityState, ID } from '../../api/types';
import { guid } from '../../api/store-utils';
import { StoreConfig } from '../../api/store-config';
import { EntityStore } from '../../api/entity-store';
import { SortBy, SortByOptions } from '../../api/query-config';


export type Filter = {
  id: ID,
  name?: string, // A corresponding name for display the filter
  order?: number, // set the order for filter
  value?: any,
  hide?: boolean, // If you want to have filter that is not displayed on the list
  function: (value: any, index: number, array: any[]) => any,
}
/**
 * A factory function that creates Wish
 */
export function createFilter(params: Partial<Filter>) {
  const id: ID = params.id? params.id : guid();
  const computedName: string = (params.value && params.id)? params.id + ': ' + params.value.toString() : undefined;

  return {order: 10, name: computedName, hide: false, ...params, id} as Filter;
}


export interface FiltersState extends EntityState<Filter> {
  sort: SortByOptions<any>
}


@StoreConfig({ name: 'filters' })
export class FiltersStore extends EntityStore<FiltersState, Filter> {
  constructor() {
    super();
  }
}
