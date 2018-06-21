import { Injectable } from '@angular/core';
import { ContactsStore } from './contacts.store';
import { ContactsDataService } from './contacts-data.service';
import { Observable } from 'rxjs';
import { PaginationResponse, Paginator } from '@datorama/akita/src/plugins/pagination';
import { Contact } from '@datorama/playground/src/app/contacts/state/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  paginator: Paginator<Contact>;

  constructor(private contactsStore: ContactsStore, private contactsDataService: ContactsDataService) {}

  getPage(params): Observable<PaginationResponse<Contact>> {
    return this.contactsDataService.getPage(params);
  }

  createPaginator(contactsQuery) {
    if (!this.paginator) {
      this.paginator = new Paginator<Contact>(contactsQuery).withControls().withRange();
    }

    return this.paginator;
  }
}
