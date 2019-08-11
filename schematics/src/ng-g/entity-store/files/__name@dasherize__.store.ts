import { Injectable } from '@angular/core';
<% if (withActive) { %>
import { EntityState, ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
<% } else { %>
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
<% } %>
import { <%= singular(classify(name)) %> } from './<%= singular(dasherize(name)) %>.model';

<% if (withActive) { %>
export interface <%= classify(name) %>State extends EntityState<<%= singular(classify(name)) %>>, ActiveState {}
<% } else { %>
export interface <%= classify(name) %>State extends EntityState<<%= singular(classify(name)) %>> {}
<% } %>

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: '<%= name %>' })
export class <%= classify(name) %>Store extends EntityStore<<%= classify(name) %>State> {

  constructor() {
    super();
  }

}

