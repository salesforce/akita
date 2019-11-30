import { Injectable } from '@angular/core';<% if (!plain) { %>
import { ID } from '@datorama/akita';<% } %>
import { HttpClient } from '@angular/common/http';
import { <%= classify(name) %>Store } from './<%= dasherize(name) %>.store';<% if (!plain) { %>
import { <%= singular(classify(name)) %> } from './<%= singular(dasherize(name)) %>.model';<% } %>
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class <%= classify(name) %>Service {

  constructor(private <%= camelize(name) %>Store: <%= classify(name) %>Store,
              private http: HttpClient) {
  }
<% if (!plain) { %>
  get() {
    return this.http.get<<%= singular(classify(name)) %>[]>('https://api.com').pipe(tap(entities => {
      this.<%= camelize(name) %>Store.set(entities);
    }));
  }

  add(<%= singular(camelize(name)) %>: <%= singular(classify(name)) %>) {
    this.<%= camelize(name) %>Store.add(<%= singular(camelize(name)) %>);
  }

  update(id, <%= singular(camelize(name)) %>: Partial<<%= singular(classify(name)) %>>) {
    this.<%= camelize(name) %>Store.update(id, <%= singular(camelize(name)) %>);
  }

  remove(id: ID) {
    this.<%= camelize(name) %>Store.remove(id);
  }<% } %>
}
