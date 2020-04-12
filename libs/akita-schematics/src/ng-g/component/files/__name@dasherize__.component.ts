import { Component, OnInit } from '@angular/core';
import { <%= classify(name) %>Service } from '../state/<%= dasherize(name) %>.service';
import { <%= classify(name) %>Query } from '../state/<%= dasherize(name) %>.query';<% if (entity) { %>
import { <%= singular(classify(name)) %> } from '../state/<%= singular(dasherize(name)) %>.model';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';<% } %>

@Component({
  selector: '<%= selector %>',
  templateUrl: './<%= dasherize(name) %>.component.html',
  styleUrls: ['./<%= dasherize(name) %>.component.<%= styleext %>']
})
export class <%= classify(name) %>Component implements OnInit {
  <%if (entity){%><%= camelize(name) %>$: Observable<<%= singular(classify(name)) %>[]>;
  isLoading$: Observable<boolean>;<%}%>

  constructor(private <%= camelize(name) %>Query: <%= classify(name) %>Query,
              private <%= camelize(name) %>Service: <%= classify(name) %>Service
  ) { }

  <% if (!entity) { %>ngOnInit() {}<% } %><% if (entity) { %>ngOnInit() {
      this.<%= camelize(name) %>$ = this.<%= camelize(name) %>Query.selectAll();
      this.isLoading$ = this.<%= camelize(name) %>Query.selectLoading();

      // this.<%= camelize(name) %>Service.get().subscribe({
     //   error(err) {
     //     this.error = err;
     //   }
    //  });
    }

    add(<%= singular(camelize(name)) %>: <%= singular(classify(name)) %>) {
      this.<%= camelize(name) %>Service.add(<%= singular(camelize(name)) %>);
    }

    update(id: ID, <%= singular(camelize(name)) %>: Partial<<%= singular(classify(name)) %>>) {
      this.<%= camelize(name) %>Service.update(id, <%= singular(camelize(name)) %>);
    }

    remove(id: ID) {
      this.<%= camelize(name) %>Service.remove(id);
    }<% } %>
}
