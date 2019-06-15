import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { <%= singular(classify(name)) %> } from './<%= singular(dasherize(name)) %>.model';

export interface <%= classify(name) %>State extends EntityState<<%= singular(classify(name)) %>> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: '<%= name %>' })
export class <%= classify(name) %>Store extends EntityStore<<%= classify(name) %>State, <%= singular(classify(name)) %>> {

  constructor() {
    super();
  }

}

