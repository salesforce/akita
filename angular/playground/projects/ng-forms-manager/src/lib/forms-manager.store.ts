import { Store, StoreConfig } from '@datorama/akita';

@StoreConfig({
  name: 'formsManager'
})
export class FormsStore extends Store {
  constructor(state) {
    super(state);
  }
}
