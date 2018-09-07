import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { {{pascalCase name}}Store, {{singular (pascalCase name)}}State } from './{{dashCase name}}.store';

@Injectable({ providedIn: 'root' })
export class {{pascalCase name}}Query extends Query<{{singular (pascalCase name)}}State> {

  constructor(protected store: {{pascalCase name}}Store) {
    super(store);
  }

}
