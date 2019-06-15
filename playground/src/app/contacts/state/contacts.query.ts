import { Injectable } from '@angular/core';
import { ContactsStore, ContactState } from './contacts.store';
import { Contact } from './contact.model';
import { QueryEntity } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class ContactsQuery extends QueryEntity<ContactState, Contact> {
  constructor(protected store: ContactsStore) {
    super(store);
  }
}
