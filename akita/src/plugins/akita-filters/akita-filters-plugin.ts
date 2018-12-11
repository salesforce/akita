import { EntityState, HashMap, ID } from '../../api/types';
import { EntityCollectionPlugin } from '../entity-collection-plugin';
import { QueryEntity, SelectOptions } from '../../api/query-entity';
import { createFilter, AkitaFilter, FiltersState, AkitaFiltersStore } from './akita-filters-store';
import { AkitaFiltersQuery } from './akita-filters-query';
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

export class AkitaFiltersPlugin<S extends EntityState<E> = any, E = any, P = any> extends EntityCollectionPlugin<E, P> {
  private _selectFilters$: Observable<AkitaFilter<E>[]>;
  private readonly _filtersStore: AkitaFiltersStore<E>;
  private readonly _filtersQuery: AkitaFiltersQuery<E>;

  get filtersStore(): AkitaFiltersStore<E> {
    return this._filtersStore;
  }

  get filtersQuery(): AkitaFiltersQuery<E> {
    return this._filtersQuery;
  }

  constructor( protected query: QueryEntity<S, E>, private params: FiltersParams = {} ) {
    super(query, params.entityIds);
    this.params = { ...{ filtersStoreName: this.getStore().storeName + 'Filters' }, ...params };

    this._filtersStore = new AkitaFiltersStore<E>(this.params.filtersStoreName);
    this._filtersQuery = new AkitaFiltersQuery<E>(this._filtersStore);

    this._selectFilters$ = this._filtersQuery.selectAll({ sortBy: 'order' });
  }

  /**
   *  Select all filters
   *
   *  Note: filters with hide=true, will not be displayed. If you want it, call directly to:
   * `this.filtersQuery.selectAll()`
   */
  selectFilters(): Observable<AkitaFilter<E>[]> {
    return this._filtersQuery.selectAll({ sortBy: 'order', filterBy: filter => !filter.hide });
  }

  /**
   * Get all the current snapshot filters
   *
   *  Note: filters with hide=true, will not be displayed. If you want it, call directly to:
   * `this.filtersQuery.getAll()`
   */
  getFilters(): AkitaFilter<E>[] {
    return this._filtersQuery.getAll({ filterBy: filter => !filter.hide });
  }

  /**
   * Select All Entity with apply filter to it, and updated with any change (entity or filter)
   */
  selectAllByFilters(options: SelectOptions<E> = {} ): Observable<E[]> {
    return combineLatest(this._selectFilters$, this.getQuery().selectAll(options), this.filtersQuery.select(state => state.sort)).pipe(
      map(( [filters, entities, sort] ) => {
        let entitiesFiltered = this.applyFilters(entities, filters);

        if( sort && sort.sortBy ) {
          let _sortBy: any = isFunction(sort.sortBy) ? sort.sortBy : compareValues(sort.sortBy, sort.sortByOrder);
          entitiesFiltered = [...entitiesFiltered.sort(( a, b ) => _sortBy(a, b, entities))];
        }

        return entitiesFiltered;
      })
    );
  }

  /**
   * Create or update a filter
   */
  setFilter( filter: Partial<AkitaFilter<E>> ) {
    const entity = createFilter(filter);
    this.filtersStore.createOrReplace(entity.id, entity);
  }

  /**
   * Remove a Filter
   */
  removeFilter( id: ID ) {
    this.filtersStore.remove(id);
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.filtersStore.remove();
  }

  /**
   * Get filter value, return null, if value not available
   */
  getFilterValue<T = any>( id: string ): T | null {
    if( this.filtersQuery.hasEntity(id) ) {
      const entity: AkitaFilter<E> = this.filtersQuery.getEntity(id);
      return entity.value ? entity.value : null;
    }

    return null;
  }

  /**
   * Get filter value, return null, if value not available
   */
  getSortValue(): SortByOptions<E> | null {
    const state: FiltersState<E> = this.filtersQuery.getSnapshot();
    return state.sort ? state.sort : null;
  }

  /**
   * Set orderBy
   */
  setSortBy( order: SortByOptions<E> ) {
    this.filtersStore.updateRoot({ sort: order });
  }

  /**
   * Get the filters normalized as key value or as query params.
   * This can be useful for server-side filtering
   */
  getNormalizedFilters( options: { withSort?: boolean, asQueryParams?: boolean, sortByKey?: string, sortByOrderKey?: string,  } = {} ): string | HashMap<any> {
    let result = {};
    options = {sortByKey: 'sortBy', sortByOrderKey: 'sortByOrder', ...options};

    for( const filter of this.getFilters() ) {
      result[filter.id] = filter.value;
    }

    if( options.withSort ) {
      const sort = this.getSortValue();
      result[options.sortByKey] = sort.sortBy;
      result[options.sortByOrderKey] = sort.sortByOrder;
    }

    if( options.asQueryParams ) {
      return this.serialize(result);
    }

    return result;
  }

  private serialize( obj ) {
    return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
  }

  private applyFilters( entities: E[], filters: AkitaFilter<E>[] ): E[] {
    if( filters.length === 0 ) return entities;
    return entities.filter(( entity: E, index: number, array: E[] ) => {
      return filters.every(( filter: AkitaFilter<E> ) => {
        if( filter.predicate ) {
          return !!filter.predicate(entity, index, array, filter);
        }
        return true;
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

