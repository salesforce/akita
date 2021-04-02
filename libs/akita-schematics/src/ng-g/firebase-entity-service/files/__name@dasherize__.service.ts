import { Injectable } from '@angular/core';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';
import { <%= classify(name) %>Store, <%= classify(name) %>State } from './<%= dasherize(name) %>.store';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: '<%= dasherize(plural(name)) %>' })
export class <%= classify(name) %>Service extends CollectionService<<%= classify(name) %>State> {

  constructor(store: <%= classify(name) %>Store) {
    super(store);
  }

}
