import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ContactsStore, State } from './contacts.store';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsQuery extends QueryEntity<State, Contact> {
  constructor(protected store: ContactsStore) {
    super(store);
  }
}
