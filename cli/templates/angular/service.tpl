import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { {{pascalCase name}}Store } from './{{dashCase name}}.store';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class {{pascalCase name}}Service {

  constructor(private {{camelCase name}}Store: {{pascalCase name}}Store,
              private http: HttpClient) {
  }

  get() {
    // this.http.get().subscribe((entities: ServerResponse) => {
      // this.{{camelCase name}}Store.set(entities);
    // });
  }

  add() {
    // this.http.post().subscribe((entity: ServerResponse) => {
      // this.{{camelCase name}}Store.add(entity);
    // });
  }

}
