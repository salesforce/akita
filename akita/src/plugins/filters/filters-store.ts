import { EntityState, ID } from '../../api/types';
import { guid } from '../../api/store-utils';
import { StoreConfig } from '../../api/store-config';
import { EntityStore } from '../../api/entity-store';


export type Filter = {
  id: ID,
  name?: string, // A corresponding name for display the filter
  function: (value: Filter, index: number, array: Filter[]) => any,
}
/**
 * A factory function that creates Wish
 */
export function createFilter(params: Partial<Filter>) {
  const id: ID = params.id? params.id : guid();
  return {...params, id} as Filter;
}


export interface FiltersState extends EntityState<Filter> {
}


@StoreConfig({ name: 'filters' })
export class FiltersStore extends EntityStore<FiltersState, Filter> {
  constructor() {
    super();
  }
}
