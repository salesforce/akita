import { AddOptions, EntityState, ID } from '../../api/types';
import { EntityCollectionPlugin } from '../entity-collection-plugin';
import { FilterPlugin } from './filter-plugin';
import { QueryEntity, SelectOptions } from '../../api/query-entity';
import { createFilter, Filter, FiltersState, FiltersStore } from './filters-store';
import { FiltersQuery } from './filters-query';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SortByOptions } from '../../api/query-config';
import { isFunction } from '../../internal/utils';
import { compareValues } from '../../internal/sort';

export type FiltersParams = {
  entityIds?: ID | ID[];
  [key: string]: any;
};

/**
 * Helper function to do search
 * @param searchKey
 * @param inObj
 */
export var searchObjFunction = function(searchKey: string, inObj) {
  return Object.keys(inObj).some(function(key) {
    return  typeof inObj[key] === 'string' && inObj[key].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase());
  });
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
    this.params = { ...{  }, ...params };

    this._filterStore = new FiltersStore();
    this._filterQuery = new FiltersQuery(this._filterStore);

    this._selectFilter$ = this._filterQuery.selectAll({sortBy: 'order'});
  }

  /**
   * Get all the filters
   */
  selectFilters(): Observable<Filter[]> {
    return this._filterQuery.selectAll({sortBy: 'order', filterBy: (filter) => !filter.hide});
  }

  /**
   * Get all the filters
   */
  getFilters(): Filter[] {
    return this._filterQuery.getAll({filterBy: (filter) => !filter.hide});
  }

  /**
   * Select All Entity with apply filter to it, and updated with any change (entity or filter)
   * @param options
   */
  selectAllByFilter(options: SelectOptions<E> = {}): Observable<E[]> {
      return combineLatest(
          this._selectFilter$,
          this.query.selectAll(options),
          this.filterQuery.select((state) => state.sort))
        .pipe(
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
   * Get filter value, return null, if value not available
   * @param id
   */
  getFilterValue(id: string): any | null {
    if (this.filterQuery.hasEntity(id)) {
      const entity: Filter = this.filterQuery.getEntity(id);
      return entity.value? entity.value : null;
    }
    return null;
  }

  /**
   * Get filter value, return null, if value not available
   * @param id
   */
  getSortValue(): SortByOptions<E> | null {
      const state: FiltersState = this.filterQuery.getSnapshot();
      return state.sort? state.sort : null;
  }

  /**
   * Set orderBy
   * @param order
   */
  setSortBy(order: SortByOptions<E>) {
    this.filterStore.updateRoot({sort: order});
  }



  private applyFilters(entities: E[], filters: Filter[]) {
    let entitiesFiltered: E[] = entities;
    for (let filter of filters) {
      if (filter.function) {
        // @ts-ignore
        entitiesFiltered = entitiesFiltered.filter<E>(filter.function);
      }
    }
    return entitiesFiltered;
  }

  protected instantiatePlugin(id: ID): P {
    return new FilterPlugin(this.query) as P;
  }

  destroy(id?: ID) {

  }

}


