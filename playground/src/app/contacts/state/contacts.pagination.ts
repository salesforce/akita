import { Paginator } from '@datorama/akita/src/plugins/pagination';
import { Contact } from '@datorama/playground/src/app/contacts/state/contact.model';
import { ContactsQuery } from '@datorama/playground/src/app/contacts/state/index';
import { inject, InjectionToken, Type } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

let paginator: Paginator<Contact>;

export function createPaginator(contactsQuery) {
  if (!paginator) {
    paginator = new Paginator<Contact>(contactsQuery).withControls().withRange();
  }

  return paginator;
}

export const CONTACTS_PAGINATOR = createPaginationProvider<Contact>(ContactsQuery);
//
// export const contactsPaginatorProvider = {
//   provide: CONTACTS_PAGINATOR,
//   useFactory: ( contactsQuery: ContactsQuery ) => new Paginator<Contact>(contactsQuery).withControls().withRange(),
//   deps: [ContactsQuery]
// };

export function createPaginationProvider<E>(query: Type<QueryEntity<any, E>>) {
  return new InjectionToken<Paginator<E>>('Paginator', {
    providedIn: 'root',
    factory: () => new Paginator<E>(inject(query)).withRange().withControls()
  });
}
