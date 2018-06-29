import { InjectionToken } from '@angular/core';
import { ContactsQuery } from './contacts.query';
import { Contact } from './contact.model';
import { Paginator } from '../../../../../akita/src';

// let paginator: Paginator<Contact>;
//
// export function createPaginator(contactsQuery) {
//   if (!paginator) {
//     paginator = new Paginator<Contact>(contactsQuery).withControls().withRange();
//   }
//
//   return paginator;
// }

export const CONTACTS_PAGINATOR = new InjectionToken('CONTACTS_PAGINATOR');

export function factory(contactsQuery: ContactsQuery) {
  return new Paginator<Contact>(contactsQuery).withControls().withRange();
}

export const contactsPaginatorProvider = {
  provide: CONTACTS_PAGINATOR,
  useFactory: factory,
  deps: [ContactsQuery]
};
