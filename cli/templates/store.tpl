import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export type {{singular (pascalCase name)}}State = {
}

export function createInitial{{singular (pascalCase name)}}State() : {{singular (pascalCase name)}}State {
  return {};
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: '{{name}}' })
export class {{pascalCase name}}{{#if UIStore}}UI{{/if}}Store extends Store<{{singular (pascalCase name)}}State> {

  constructor() {
    super(createInitial{{singular (pascalCase name)}}State());
  }

}

