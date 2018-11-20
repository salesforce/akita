import { Filter, FiltersState, FiltersStore } from './filters-store';
import { QueryEntity } from '../../api/query-entity';

export class FiltersQuery extends QueryEntity<
  FiltersState,
  Filter,
  string
  > {
  constructor(protected store: FiltersStore) {
    super(store);
  }
}

