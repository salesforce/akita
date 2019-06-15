import { Injectable } from '@angular/core';
import { PaginationResponse } from '@datorama/akita';
import { Contact } from './contact.model';
import { Observable } from 'rxjs';
import { getContacts } from '../../server';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  get(params): Observable<PaginationResponse<Contact>> {
    return getContacts(params);
  }
}
