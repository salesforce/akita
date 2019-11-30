import { Injectable } from '@angular/core';
import { <%= singular(classify(name)) %> } from './<%= singular(dasherize(name)) %>.model';
import { EntityState<% if (withActive) { %>, ActiveState<%}%>, EntityStore, StoreConfig } from '@datorama/akita';

export interface <%= classify(name) %>State extends <%= extensionState %> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: '<%= name %>' })
export class <%= classify(name) %>Store extends EntityStore<<%= classify(name) %>State> {

  constructor() {
    super();
  }

}

