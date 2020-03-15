import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface {{ pascalCase name }}State {
  key: string;
}

export function createInitialState(): {{ pascalCase name }}State {
  return {
    key: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: '{{name}}' })
export class {{pascalCase name}}Store extends Store<{{pascalCase name}}State> {

  constructor() {
    super(createInitialState());
  }

}

