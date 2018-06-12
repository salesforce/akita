import { Injectable } from '@angular/core';
import { {{queryClassPostfix storeType}} } from '@datorama/akita';
import { {{pascalCase name}}{{#if UIStore}}UI{{/if}}Store, State } from './{{dashCase name}}.store';
import { {{singular (pascalCase name)}} } from './{{singular (dashCase name)}}.model';

@Injectable({
  providedIn: 'root'
})
export class {{pascalCase name}}{{#if UIStore}}UI{{/if}}Query extends {{queryClassPostfix storeType}}<State{{#if isEntityStore}}, {{singular (pascalCase name)}}{{/if}}> {

  constructor(protected store: {{pascalCase name}}{{#if UIStore}}UI{{/if}}Store) {
    super(store);
  }

}
