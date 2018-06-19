import { Component, Inject, OnInit } from '@angular/core';
import { ContactsQuery } from '@datorama/playground/src/app/contacts/state/contacts.query';
import { ContactsService } from '../state/contacts.service';
import { combineLatest } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@datorama/playground/node_modules/@angular/router';
import { FormControl } from '@datorama/playground/node_modules/@angular/forms';
import { Paginator } from '@datorama/akita/src/api/pagination';
import { Contact } from '@datorama/playground/src/app/contacts/state';
import { CONTACTS_PAGINATOR, createPaginator } from '@datorama/playground/src/app/contacts/state/contacts.pagination';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.css']
})
export class ContactsPageComponent implements OnInit {
  // paginatorRef: Paginator<Contact>;
  pagination$;
  sortByControl: FormControl;
  perPageControl: FormControl;

  constructor(private contactsQuery: ContactsQuery, private route: ActivatedRoute, @Inject(CONTACTS_PAGINATOR) public paginatorRef: Paginator<Contact>, private contactsService: ContactsService) {}

  ngOnInit() {
    // Different ways to create singleton
    // this.paginatorRef = createPaginator(this.contactsQuery);
    // this.paginator = this.contactsService.createPaginator(this.contactsQuery);

    const sortByInit = this.paginatorRef.metadata.get('sortBy') || 'name';
    const perPageInit = this.paginatorRef.metadata.get('perPage') || '10';

    this.sortByControl = new FormControl(sortByInit);
    this.perPageControl = new FormControl(perPageInit);
    // this.route.queryParamMap.pipe(map(params => +params.get('page'))).subscribe(page => {
    //   this.paginator.setPage(page);
    // });
    //
    // this.pagination$ = this.paginator.pageChanges.pipe(
    //   switchMap(( page ) => {
    //     const req = () => this.contactsService.getPage({
    //       page,
    //       perPage: 10
    //     });
    //     return this.paginator.getPage(req);
    //   })
    // );

    const sort = this.sortByControl.valueChanges.pipe(startWith(sortByInit));

    const perPage = this.perPageControl.valueChanges.pipe(startWith(+perPageInit));

    this.pagination$ = combineLatest(this.paginatorRef.pageChanges, combineLatest(sort, perPage).pipe(tap(_ => this.paginatorRef.clearCache()))).pipe(
      switchMap(([page, [sortBy, perPage]]) => {
        const req = () =>
          this.contactsService.getPage({
            page,
            sortBy,
            perPage
          });
        this.paginatorRef.metadata.set('sortBy', sortBy);
        this.paginatorRef.metadata.set('perPage', perPage);
        return this.paginatorRef.getPage(req);
      })
    );
  }

  ngOnDestroy() {
    this.paginatorRef.destroy();
  }
}
