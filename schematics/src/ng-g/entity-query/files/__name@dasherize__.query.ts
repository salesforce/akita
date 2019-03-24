import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { <%= classify(name) %>Store, <%= classify(name) %>State } from './<%= dasherize(name) %>.store';
import { <%= singular(classify(name)) %> } from './<%= singular(dasherize(name)) %>.model';

@Injectable({
  providedIn: 'root'
})
export class <%= classify(name) %>Query extends QueryEntity<<%= classify(name) %>State, <%= singular(classify(name)) %>> {

  constructor(protected store: <%= classify(name) %>Store) {
    super(store);
  }

}
