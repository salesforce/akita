import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { <%= classify(name) %>Store, <%= classify(name) %>State } from './<%= dasherize(name) %>.store';

@Injectable({ providedIn: 'root' })
export class <%= classify(name) %>Query extends QueryEntity<<%= classify(name) %>State> {

  constructor(protected store: <%= classify(name) %>Store) {
    super(store);
  }

}
