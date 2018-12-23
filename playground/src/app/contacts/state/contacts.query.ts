import { Injectable } from '@angular/core';
import { ContactsStore, State } from './contacts.store';
import { Contact } from './contact.model';
import { QueryEntity } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class ContactsQuery extends QueryEntity<State, Contact> {
  constructor(protected store: ContactsStore) {
    super(store);
  }
}
