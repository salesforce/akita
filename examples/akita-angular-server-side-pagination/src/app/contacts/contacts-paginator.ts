import { inject, InjectionToken } from '@angular/core';
import { ContactsQuery } from './state/contacts.query';
import { PaginatorPlugin } from '@datorama/akita';

export const CONTACTS_PAGINATOR = new InjectionToken('CONTACTS_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    const contactsQuery = inject(ContactsQuery);
    return new PaginatorPlugin(contactsQuery).withControls().withRange();
  }
});
