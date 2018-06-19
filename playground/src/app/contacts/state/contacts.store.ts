import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@datorama/akita';
import { Contact } from './contact.model';

export interface State extends EntityState<Contact> {}

@Injectable({
  providedIn: 'root'
})
export class ContactsStore extends EntityStore<State, Contact> {
  constructor() {
    super();
  }
}
