import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ContactsStore, ContactsState } from './contacts.store';

@Injectable({
  providedIn: 'root'
})
export class ContactsQuery extends QueryEntity<ContactsState> {
  constructor(protected store: ContactsStore) {
    super(store);
  }
}
