import { EntityState, ID } from '../../api/types';
import { EntityCollectionPlugin } from '../entity-collection-plugin';
import { QueryEntity, SelectOptions } from '../../api/query-entity';
import { createFilter, Filter, FiltersState, FiltersStore } from './filters-store';
import { FiltersQuery } from './filters-query';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SortByOptions } from '../../api/query-config';
import { isFunction } from '../../internal/utils';
import { compareValues } from '../../internal/sort';
import { AkitaPlugin, Queries } from '../plugin';

export type FiltersParams = {
  entityIds?: ID | ID[];
  filtersStoreName?: string;
  [key: string]: any;
};

/**
 * Filters plugins is usefull to define some filters to be apply for your query
 *
 */
export class FiltersPlugin<S extends EntityState<E> = any, E = any, P extends FilterPlugin<E, S> = any> extends EntityCollectionPlugin<E, P> {
  private _selectFilter$: Observable<Filter[]>;
  private readonly _filterStore: FiltersStore;
  private readonly _filterQuery: FiltersQuery;

  get filterStore(): FiltersStore {
    return this._filterStore;
  }

  get filterQuery(): FiltersQuery {
    return this._filterQuery;
  }

  constructor(protected query: QueryEntity<S, E>, private params: FiltersParams = {}) {
    super(query, params.entityIds);
    this.params = { ...{ filtersStoreName: query.__store__.storeName + 'Filters' }, ...params };

    this._filterStore = new FiltersStore();
    this._filterQuery = new FiltersQuery(this._filterStore);

    this._selectFilter$ = this._filterQuery.selectAll({ sortBy: 'order' });
  }

  /**
   * Select all the filters
   *
   * Note: filters with hide=true, will not be displayed. If you want it, call directly the filterQuery :
   * `this.filterQuery.selectAll()`
   */
  selectFilters(): Observable<Filter[]> {
    return this._filterQuery.selectAll({ sortBy: 'order', filterBy: filter => !filter.hide });
  }

  /**
   * Get all the current snapshot filters
   *
   *  Note: filters with hide=true, will not be displayed. If you want it, call directly the filterQuery :
   * `this.filterQuery.getAll()`
   */
  getFilters(): Filter[] {
    return this._filterQuery.getAll({ filterBy: filter => !filter.hide });
  }

  /**
   * Select All Entity with apply filter to it, and updated with any change (entity or filter)
   * @param options
   */
  selectAllByFilter(options: SelectOptions<E> = {}): Observable<E[]> {
    return combineLatest(this._selectFilter$, this.query.selectAll(options), this.filterQuery.select(state => state.sort)).pipe(
      map(([filters, entities, sort]) => {
        let entitiesFiltered = this.applyFilters(entities, filters);

        if (sort) {
          let _sortBy: any = isFunction(sort.sortBy) ? sort.sortBy : compareValues(sort.sortBy, sort.sortByOrder);
          entitiesFiltered = entitiesFiltered.sort((a, b) => _sortBy(a, b, entities));
        }

        return entitiesFiltered;
      })
    );
  }

  /**
   * Create or update a filter
   * @param id
   * @param filter
   */
  setFilter(filter: Partial<Filter>) {
    const entity = createFilter(filter);
    this.filterStore.createOrReplace(entity.id, entity);
  }

  /**
   * Remove a Filter
   * @param id
   */
  removeFilter(id: string) {
    this.filterStore.remove(id);
  }

  /**
   * Clear all filters
   */
  cleanFilters() {
    this.filterStore.remove();
  }

  /**
   * Get filter value, return null, if value not available
   * @param id
   */
  getFilterValue(id: string): any | null {
    if (this.filterQuery.hasEntity(id)) {
      const entity: Filter = this.filterQuery.getEntity(id);
      return entity.value ? entity.value : null;
    }
    return null;
  }

  /**
   * Get filter value, return null, if value not available
   * @param id
   */
  getSortValue(): SortByOptions<E> | null {
    const state: FiltersState = this.filterQuery.getSnapshot();
    return state.sort ? state.sort : null;
  }

  /**
   * Set orderBy
   * @param order
   */
  setSortBy(order: SortByOptions<E>) {
    this.filterStore.updateRoot({ sort: order });
  }

  private applyFilters(entities: E[], filters: Filter[]): E[] {
    if (filters.length === 0) return entities;
    return entities.filter((value: E, index: number, array: E[]) => {
      return !filters.some((filter: Filter) => {
        if (filter.function) {
          return !filter.function(value, index, array, filter);
        }
        return false;
      });
    });
  }

  protected instantiatePlugin(id: ID): P {
    return new FilterPlugin(this.query) as P;
  }

  destroy(id?: ID) {}
}

class FilterPlugin<E = any, S = any> extends AkitaPlugin<E, S> {
  constructor(protected query: Queries<E, S>) {
    super(query);
  }
  destroy() {}
}
