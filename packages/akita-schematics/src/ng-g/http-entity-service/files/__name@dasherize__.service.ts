import { Injectable } from '@angular/core';
import { NgEntityService } from '@datorama/akita-ng-entity-service';
import { <%= classify(name) %>Store, <%= classify(name) %>State } from './<%= dasherize(name) %>.store';

@Injectable({ providedIn: 'root' })
export class <%= classify(name) %>Service extends NgEntityService<<%= classify(name) %>State> {

  constructor(protected store: <%= classify(name) %>Store) {
    super(store);
  }

}
