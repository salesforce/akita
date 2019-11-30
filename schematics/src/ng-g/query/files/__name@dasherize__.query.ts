import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { <%= classify(name) %>Store, <%= classify(name) %>State } from './<%= dasherize(name) %>.store';

@Injectable({ providedIn: 'root' })
export class <%= classify(name) %>Query extends Query<<%= classify(name) %>State> {

  constructor(protected store: <%= classify(name) %>Store) {
    super(store);
  }

}
