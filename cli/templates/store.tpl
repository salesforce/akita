import { Injectable } from '@angular/core';
import { {{#if isEntityStore}}EntityState, {{/if}}{{storeClassPostfix storeType}}, StoreConfig } from '@datorama/akita';
import { {{singular (pascalCase name)}} } from './{{singular (dashCase name)}}.model';

{{#switch storeType}}
{{#case "Store"}}
export interface State {

}
{{/case}}
{{#case "Entity Store"}}
export interface State extends EntityState<{{singular (pascalCase name)}}> {}
{{/case}}
{{/switch}}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: '{{name}}' })
export class {{pascalCase name}}{{#if UIStore}}UI{{/if}}Store extends {{storeClassPostfix storeType}}<State{{#if isEntityStore}}, {{singular (pascalCase name)}}{{/if}}> {

  constructor() {
    super();
  }

}

