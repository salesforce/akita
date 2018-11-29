import { Filter, FiltersState, FiltersStore } from './filters-store';
import { QueryEntity } from '../../api/query-entity';
import { QueryConfig } from '../../api/query-config';
import { Order } from '../../internal/sort';

@QueryConfig({
  sortBy: 'order',
  sortByOrder: Order.ASC
})
export class FiltersQuery<E> extends QueryEntity<FiltersState<E>, Filter<E>, string> {
  constructor(protected store: FiltersStore<E>) {
    super(store);
  }
}
