import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ContactsStore, ContactsState } from './contacts.store';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsQuery extends QueryEntity<ContactsState, Contact> {
  constructor(protected store: ContactsStore) {
    super(store);
  }
}
