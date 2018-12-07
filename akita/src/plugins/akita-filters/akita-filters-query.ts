import { AkitaFilter, FiltersState, AkitaFiltersStore } from './akita-filters-store';
import { QueryEntity } from '../../api/query-entity';
import { QueryConfig } from '../../api/query-config';
import { Order } from '../../internal/sort';

@QueryConfig({
  sortBy: 'order',
  sortByOrder: Order.ASC
})
export class AkitaFiltersQuery<E> extends QueryEntity<FiltersState<E>, AkitaFilter<E>, string> {
  constructor(protected store: AkitaFiltersStore<E>) {
    super(store);
  }
}
