import { inject, InjectionToken } from '@angular/core';
import { ContactsQuery } from './contacts.query';
import { Contact } from './contact.model';
import { Paginator } from '@datorama/akita';

export const CONTACTS_PAGINATOR = new InjectionToken('CONTACTS_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    return new Paginator<Contact>(inject(ContactsQuery)).withControls().withRange();
  }
});
