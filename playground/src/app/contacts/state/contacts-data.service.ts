import { Injectable } from '@angular/core';
import { getContacts } from '../contacts.data';

@Injectable({
  providedIn: 'root'
})
export class ContactsDataService {
  getPage(params) {
    return getContacts(params);
  }
}
