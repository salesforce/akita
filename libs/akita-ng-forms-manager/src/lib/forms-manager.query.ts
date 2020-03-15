import { Query } from '@datorama/akita';
import { FormsStore } from './forms-manager.store';

export class FormsQuery<T> extends Query<T> {
  constructor(store: FormsStore<T>) {
    super(store);
  }
}
