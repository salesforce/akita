import { Injectable } from '@angular/core';
import { <%= classify(name) %>Store, <%= classify(name) %>State } from './<%= dasherize(name) %>.store';
import { NgEntityService } from '@datorama/akita-ng-entity-service';

@Injectable({ providedIn: 'root' })
export class <%= classify(name) %>Service extends NgEntityService<<%= classify(name) %>State> {

  constructor(protected store: <%= classify(name) %>Store) {
    super(store);
  }

}
