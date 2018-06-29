import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { StoreConfig } from '../../../../../akita/src/api/store-config';
import { EntityState, EntityStore } from '../../../../../akita/src';

export interface State extends EntityState<Contact> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'contacts' })
export class ContactsStore extends EntityStore<State, Contact> {
  constructor() {
    super();
  }
}
