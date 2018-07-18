import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { {{pascalCase name}}{{#if UIStore}}UI{{/if}}Store, {{singular (pascalCase name)}}State } from './{{dashCase name}}.store';

@Injectable({
  providedIn: 'root'
})
export class {{pascalCase name}}{{#if UIStore}}UI{{/if}}Query extends Query<{{singular (pascalCase name)}}State> {

  constructor(protected store: {{pascalCase name}}{{#if UIStore}}UI{{/if}}Store) {
    super(store);
  }

}
