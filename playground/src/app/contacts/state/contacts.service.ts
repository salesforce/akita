import { Injectable } from '@angular/core';
import { ContactsStore } from './contacts.store';
import { ContactsDataService } from './contacts-data.service';
import { Observable } from 'rxjs';
import { PaginationResponse } from '@datorama/akita/src/plugins/pagination';
import { Contact } from '@datorama/playground/src/app/contacts/state/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  constructor(private contactsStore: ContactsStore, private contactsDataService: ContactsDataService) {}

  getPage(params): Observable<PaginationResponse<Contact>> {
    return this.contactsDataService.getPage(params);
  }
}
