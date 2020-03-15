import { Injectable } from '@angular/core';
import { {{pascalCase name}}Store, {{pascalCase name}}State } from './{{dashCase name}}.store';
import { NgEntityService } from '@datorama/akita-ng-entity-service';

@Injectable({ providedIn: 'root' })
export class {{pascalCase name}}Service extends NgEntityService<{{pascalCase name}}State> {

  constructor(protected store: {{pascalCase name}}Store) {
    super(store);
  }

}
