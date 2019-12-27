import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { {{singular (pascalCase name)}} } from './{{singular (dashCase name)}}.model';

export interface {{ pascalCase name }}State extends EntityState<{{singular (pascalCase name)}}> {}

@StoreConfig({
  name: '{{name}}'{{#if idKey}},
  idKey: '{{idKey}}'{{/if}}
})
export class {{pascalCase name}}Store extends EntityStore<{{ pascalCase name }}State> {

  constructor() {
    super();
  }

}

export const {{ camelCase name }}Store = new {{pascalCase name}}Store();

