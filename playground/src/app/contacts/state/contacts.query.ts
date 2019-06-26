import { Injectable } from '@angular/core';
import { ContactsStore, ContactState } from './contacts.store';
import { QueryEntity } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class ContactsQuery extends QueryEntity<ContactState> {
  constructor(protected store: ContactsStore) {
    super(store);
  }
}
