import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from './contact.model';
import { PaginationResponse } from '@datorama/akita';
import { getContacts } from '../contacts.data';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  getPage(params): Observable<PaginationResponse<Contact>> {
    return getContacts(params);
  }
}
