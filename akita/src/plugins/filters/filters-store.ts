import { EntityState, ID } from '../../api/types';
import { guid } from '../../api/store-utils';
import { StoreConfig } from '../../api/store-config';
import { EntityStore } from '../../api/entity-store';
import { SortByOptions } from '../../api/query-config';
import { capitalize } from '../../internal/utils';
import { defaultFilter } from './filters-utils';

export interface Filter<E> {
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
  predicate: ( entity: E, index: number, array: E[], filter: Filter<E> ) => boolean;
}

export function createFilter<E>( filterParams: Partial<Filter<E>> ) {
  const id = filterParams.id ? filterParams.id : guid();
  const name = filterParams.name || (filterParams.value && filterParams.id ? `${capitalize(filterParams.id.toString())}: ${filterParams.value.toString()}` : undefined);
  if( !filterParams.predicate && filterParams.value ) {
    /** use default function, if not provided */
    filterParams.predicate = defaultFilter;
  }

  return { id, name, hide: false, order: 10, ...filterParams } as Filter<E>;
}

export interface FiltersState<E> extends EntityState<Filter<E>> {
  sort: SortByOptions<any>;
}

@StoreConfig({ name: 'filters' })
export class FiltersStore<E> extends EntityStore<FiltersState<E>, Filter<E>> {
  constructor( storeName: string ) {
    super(undefined, { storeName });
  }
}
