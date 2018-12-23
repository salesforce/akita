import { Injectable } from '@angular/core';
import { ContactsStore } from './contacts.store';
import { ContactsDataService } from './contacts-data.service';
import { Observable } from 'rxjs';
import { Contact } from './contact.model';
import { PaginationResponse } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  constructor(private contactsStore: ContactsStore, private contactsDataService: ContactsDataService) {}

  getPage(params): Observable<PaginationResponse<Contact>> {
    return this.contactsDataService.getPage(params);
  }
}
