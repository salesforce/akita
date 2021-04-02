import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { {{pascalCase name}}Store } from './{{dashCase name}}.store';

@Injectable({ providedIn: 'root' })
export class {{pascalCase name}}Service {

  constructor(private {{camelCase name}}Store: {{pascalCase name}}Store, private http: HttpClient) {
  }

  get() {
    return this.http.get('').pipe(tap(entities => this.{{camelCase name}}Store.update(entities)));
  }

}
