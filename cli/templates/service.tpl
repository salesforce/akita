import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { {{pascalCase name}}{{#if UIStore}}UI{{/if}}Store } from './{{dashCase name}}.store';
import { {{pascalCase name}}DataService } from './{{dashCase name}}-data.service';

@Injectable({
  providedIn: 'root'
})
export class {{pascalCase name}}Service {

  constructor(private {{camelCase name}}{{#if UIStore}}UI{{/if}}Store: {{pascalCase name}}{{#if UIStore}}UI{{/if}}Store,
              private {{camelCase name}}DataService: {{pascalCase name}}DataService) {
  }

  get() {
    // this.{{camelCase name}}DataService.get().subscribe((entities: ServerResponse) => {
      // this.{{camelCase name}}Store.set(entities);
    // });
  }

  add() {
    // this.{{camelCase name}}DataService.post().subscribe((entity: ServerResponse) => {
      // this.{{camelCase name}}Store.add(entity);
    // });
  }

}
