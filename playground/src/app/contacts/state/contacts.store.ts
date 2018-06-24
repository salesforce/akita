import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@datorama/akita';
import { Contact } from './contact.model';
import { StoreConfig } from '../../../../../akita/src/api/store-config';

export interface State extends EntityState<Contact> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'contacts' })
export class ContactsStore extends EntityStore<State, Contact> {
  constructor() {
    super();
  }
}
