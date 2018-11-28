import { EntityState, HashMap, ID } from '../../api/types';
import { EntityCollectionPlugin } from '../entity-collection-plugin';
import { QueryEntity, SelectOptions } from '../../api/query-entity';
import { createFilter, Filter, FiltersState, FiltersStore } from './filters-store';
import { FiltersQuery } from './filters-query';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SortByOptions } from '../../api/query-config';
import { isFunction } from '../../internal/utils';
import { compareValues } from '../../internal/sort';

export type FiltersParams = {
  filtersStoreName?: string;
  entityIds?: ID | ID[];
  [key: string]: any;
};

export class FiltersPlugin<S extends EntityState<E> = any, E = any, P = any> extends EntityCollectionPlugin<E, P> {
  private _selectFilter$: Observable<Filter<E>[]>;
  private readonly _filterStore: FiltersStore<E>;
  private readonly _filterQuery: FiltersQuery<E>;

  get filterStore(): FiltersStore<E> {
    return this._filterStore;
  }

  get filterQuery(): FiltersQuery<E> {
    return this._filterQuery;
  }

  constructor( protected query: QueryEntity<S, E>, private params: FiltersParams = {} ) {
    super(query, params.entityIds);
    this.params = { ...{ filtersStoreName: this.getStore().storeName + 'Filters' }, ...params };

    this._filterStore = new FiltersStore<E>(this.params.filtersStoreName);
    this._filterQuery = new FiltersQuery<E>(this._filterStore);

    this._selectFilter$ = this._filterQuery.selectAll({ sortBy: 'order' });
  }

  /**
   *  Select all filters
   *
   *  Note: filters with hide=true, will not be displayed. If you want it, call directly to:
   * `this.filterQuery.selectAll()`
   */
  selectFilters(): Observable<Filter<E>[]> {
    return this._filterQuery.selectAll({ sortBy: 'order', filterBy: filter => !filter.hide });
  }

  /**
   * Get all the current snapshot filters
   *
   *  Note: filters with hide=true, will not be displayed. If you want it, call directly to:
   * `this.filterQuery.getAll()`
   */
  getFilters(): Filter<E>[] {
    return this._filterQuery.getAll({ filterBy: filter => !filter.hide });
  }

  /**
   * Select All Entity with apply filter to it, and updated with any change (entity or filter)
   */
  selectAllByFilter( options: SelectOptions<E> = {} ): Observable<E[]> {
    return combineLatest(this._selectFilter$, this.getQuery().selectAll(options), this.filterQuery.select(state => state.sort)).pipe(
      map(( [filters, entities, sort] ) => {
        let entitiesFiltered = this.applyFilters(entities, filters);

        if( sort ) {
          let _sortBy: any = isFunction(sort.sortBy) ? sort.sortBy : compareValues(sort.sortBy, sort.sortByOrder);
          entitiesFiltered = entitiesFiltered.sort(( a, b ) => _sortBy(a, b, entities));
        }

        return entitiesFiltered;
      })
    );
  }

  /**
   * Create or update a filter
   */
  setFilter( filter: Partial<Filter<E>> ) {
    const entity = createFilter(filter);
    this.filterStore.createOrReplace(entity.id, entity);
  }

  /**
   * Remove a Filter
   */
  removeFilter( id: ID ) {
    this.filterStore.remove(id);
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.filterStore.remove();
  }

  /**
   * Get filter value, return null, if value not available
   */
  getFilterValue<T = any>( id: string ): T | null {
    if( this.filterQuery.hasEntity(id) ) {
      const entity: Filter<E> = this.filterQuery.getEntity(id);
      return entity.value ? entity.value : null;
    }

    return null;
  }

  /**
   * Get filter value, return null, if value not available
   */
  getSortValue(): SortByOptions<E> | null {
    const state: FiltersState<E> = this.filterQuery.getSnapshot();
    return state.sort ? state.sort : null;
  }

  /**
   * Set orderBy
   */
  setSortBy( order: SortByOptions<E> ) {
    this.filterStore.updateRoot({ sort: order });
  }

  /**
   * Get the filters normalized as key value or as query params.
   * This can be useful for server-side filtering
   */
  getNormalizedFilters( options: { withSort?: boolean, asQueryParams?: boolean } = {} ): string | HashMap<any> {
    let result = {};

    for( const filter of this.getFilters() ) {
      result[filter.id] = filter.value;
    }

    if( options.withSort ) {
      const sort = this.getSortValue();
      result['sortBy'] = sort.sortBy;
      result['sortByOrder'] = sort.sortByOrder;
    }

    if( options.asQueryParams ) {
      return this.serialize(result);
    }

    return result;
  }

  private serialize( obj ) {
    return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
  }

  private applyFilters( entities: E[], filters: Filter<E>[] ): E[] {
    if( filters.length === 0 ) return entities;
    return entities.filter(( entity: E, index: number, array: E[] ) => {
      return !filters.some(( filter: Filter<E> ) => {
        if( filter.predicate ) {
          return !filter.predicate(entity, index, array, filter);
        }
        return false;
      });
    });
  }

  protected instantiatePlugin( id: ID ): P {
    return null;
  }

  destroy() {
    this.clearFilters();
  }
}

