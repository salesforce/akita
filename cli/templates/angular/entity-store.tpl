import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { {{singular (pascalCase name)}} } from './{{singular (dashCase name)}}.model';

export interface {{ pascalCase name }}State extends EntityState<{{singular (pascalCase name)}}> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: '{{name}}' })
export class {{pascalCase name}}Store extends EntityStore<{{ pascalCase name }}State, {{singular (pascalCase name)}}> {

  constructor() {
    super();
  }

}

