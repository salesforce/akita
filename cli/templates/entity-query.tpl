import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { {{pascalCase name}}{{#if UIStore}}UI{{/if}}Store, {{ pascalCase name }}State } from './{{dashCase name}}.store';
import { {{singular (pascalCase name)}} } from './{{singular (dashCase name)}}.model';

@Injectable({
  providedIn: 'root'
})
export class {{pascalCase name}}{{#if UIStore}}UI{{/if}}Query extends QueryEntity<{{ pascalCase name }}State, {{singular (pascalCase name)}}> {

  constructor(protected store: {{pascalCase name}}{{#if UIStore}}UI{{/if}}Store) {
    super(store);
  }

}
