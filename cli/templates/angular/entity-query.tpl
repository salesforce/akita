import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { {{pascalCase name}}Store, {{ pascalCase name }}State } from './{{dashCase name}}.store';

@Injectable({ providedIn: 'root' })
export class {{pascalCase name}}Query extends QueryEntity<{{ pascalCase name }}State> {

  constructor(protected store: {{pascalCase name}}Store) {
    super(store);
  }

}
