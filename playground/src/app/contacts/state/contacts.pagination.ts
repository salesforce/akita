import { Paginator } from '@datorama/akita/src/plugins/pagination';
import { Contact } from '@datorama/playground/src/app/contacts/state/contact.model';
import { ContactsQuery } from '@datorama/playground/src/app/contacts/state/index';
import { InjectionToken } from '@angular/core';

let paginator: Paginator<Contact>;

export function createPaginator(contactsQuery) {
  if (!paginator) {
    paginator = new Paginator<Contact>(contactsQuery).withControls().withRange();
  }

  return paginator;
}

export const CONTACTS_PAGINATOR = new InjectionToken<Paginator<Contact>>('CONTACTS_PAGINATOR');

export const contactsPaginatorProvider = {
  provide: CONTACTS_PAGINATOR,
  useFactory: (contactsQuery: ContactsQuery) => new Paginator<Contact>(contactsQuery).withControls().withRange(),
  deps: [ContactsQuery]
};
