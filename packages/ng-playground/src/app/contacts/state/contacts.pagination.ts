import { inject, InjectionToken } from '@angular/core';
import { ContactsQuery } from './contacts.query';
import { Paginator } from '@datorama/akita';
import { ContactState } from './contacts.store';

export const CONTACTS_PAGINATOR = new InjectionToken('CONTACTS_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    return new Paginator<ContactState>(inject(ContactsQuery)).withControls().withRange();
  }
});
