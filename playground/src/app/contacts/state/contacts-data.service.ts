import { Injectable } from '@angular/core';
import { getContacts } from '@datorama/playground/src/app/contacts/contacts.data';

@Injectable({
  providedIn: 'root'
})
export class ContactsDataService {
  getPage(params) {
    return getContacts(params);
  }
}
