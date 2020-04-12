import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface <%= classify(name) %>State {
   key: string;
}

export function createInitialState(): <%= classify(name) %>State {
  return {
    key: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: '<%= name %>' })
export class <%= classify(name) %>Store extends Store<<%= classify(name) %>State> {

  constructor() {
    super(createInitialState());
  }

}

