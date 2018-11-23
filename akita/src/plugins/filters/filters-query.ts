import { Filter, FiltersState, FiltersStore } from './filters-store';
import { QueryEntity } from '../../api/query-entity';
import { QueryConfig } from '../../api/query-config';
import { Order } from '../../internal/sort';

@QueryConfig({
  sortBy: 'order',
  sortByOrder: Order.ASC
})
export class FiltersQuery extends QueryEntity<FiltersState, Filter, string> {
  constructor(protected store: FiltersStore) {
    super(store);
  }
}
