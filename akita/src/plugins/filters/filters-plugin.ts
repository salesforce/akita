import { AddOptions, EntityState, ID } from '../../api/types';
import { EntityCollectionPlugin } from '../entity-collection-plugin';
import { FilterPlugin } from './filter-plugin';
import { QueryEntity } from '../../api/query-entity';
import { createFilter, Filter, FiltersStore } from './filters-store';
import { FiltersQuery } from './filters-query';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';


export type FiltersParams = {
  entityIds?: ID | ID[];
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
    this.params = { ...{  }, ...params };

    this._filterStore = new FiltersStore();
    this._filterQuery = new FiltersQuery(this._filterStore);

    this._selectFilter$ = this.selectFilters();
  }

  selectFilters(): Observable<Filter[]> {
    return this._filterQuery.selectAll();
  }


  selectAllByFilter(options): Observable<E[]> {
      return combineLatest(this._selectFilter$, this.query.selectAll(options)).pipe(
        map<E[]>((filters: Filter[], entities: E[]) => {
          let entitiesFiltered = this.applyFilters(entities, filters);
          return entitiesFiltered;
    }));
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


