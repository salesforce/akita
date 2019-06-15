import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CONTACTS_PAGINATOR } from '../contacts-paginator';
import { Contact } from '../state/contact.model';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { ContactsService } from '../state/contacts.service';
import { combineLatest, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss']
})
export class ContactsPageComponent implements OnInit, OnDestroy {
  contacts$: Observable<PaginationResponse<Contact>>;
  sortByControl: FormControl;

  constructor(@Inject(CONTACTS_PAGINATOR) private paginatorRef: PaginatorPlugin<Contact>, private contactsService: ContactsService) {}

  ngOnInit() {
    const sortByValue = this.paginatorRef.metadata.get('sortBy') || 'name';
    this.sortByControl = new FormControl(sortByValue);

    const sort$ = this.sortByControl.valueChanges.pipe(startWith(sortByValue));

    this.contacts$ = combineLatest([sort$.pipe(tap(() => this.paginatorRef.clearCache())), this.paginatorRef.pageChanges]).pipe(
      switchMap(([sortBy, page]) => {
        const requestFn = () => this.contactsService.get({ page, sortBy });
        this.paginatorRef.metadata.set('sortBy', sortBy);
        return this.paginatorRef.getPage(requestFn);
      }),
      untilDestroyed(this)
    );
  }

  ngOnDestroy() {
    this.paginatorRef.destroy();
  }
}
