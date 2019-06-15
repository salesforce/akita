import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface ContactState extends EntityState<Contact> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'contacts' })
export class ContactsStore extends EntityStore<ContactState, Contact> {
  constructor() {
    super();
  }
}
