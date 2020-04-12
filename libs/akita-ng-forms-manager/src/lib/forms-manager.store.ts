import { Store, StoreConfig } from '@datorama/akita';

@StoreConfig({
  name: 'formsManager'
})
export class FormsStore<T> extends Store<T> {
  constructor(state: T) {
    super(state);
  }
}
