# Server Side Pagination Made Easy with Akita and Angular

## Introduction
When developing applications, we often need to deal with a large data-sets. Imagine a scenario where we have one million records in the database, and we require to show it on a web page.

We generally want to avoid sending all the data at once. The reasons for that are 1) We want a faster initial page load. 2) We don’t want to bloat the user’s machine memory.

Instead, server-side paging is used, where the server sends just a single page at a time.

In addition to that, we also want to cache pages that already have been fetched, to spare the need for an additional request. To save you the hassle and help you manage this whole thing, we created the PaginatorPlugin.

## The Paginator Plugin

The Paginator API provides two useful features:
1. Caching of pages which have already been fetched.
2. A pagination functionally, which gives you all the things you need to manage pagination in the application.

Here is the plugin in action:
// gif

Let's learn how to use it.

## Create the Scaffold
We need to maintain a collection of contacts, so we'll use an `EntityStore`. You can think of an entity store as a table in a database, where each table represents a flat collection of entities.

Let's create a contacts table, i.e., an `EntityStore` managing a Contact object:

```ts
// store
export interface ContactsState extends EntityState<Contact> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'contacts' })
export class ContactsStore extends EntityStore<ContactsState, Contact> {
  constructor() {
    super();
  }
}

// query
@Injectable({ providedIn: 'root' })
export class ContactsQuery extends QueryEntity<ContactsState, Contact> {
  constructor(protected store: ContactsStore) {
    super(store);
  }
}

// model
import { ID } from '@datorama/akita';

export interface Contact {
  id: ID;
  email: string;
  name: string;
  address: string;
}
```
We created the basic building blocks of Akita. Now, let's create the `ContactsService` which 
is responsible for fetching the data:

```
@Injectable({ providedIn: 'root' })
export class ContactsService {
  get(params): Observable<PaginationResponse<Contact>> {
    return getContacts(params);
  }
}
```
The `getContact` function is a mock implementation which returns the required server data with a one-second delay.

## Basic Pagination:
First, we need to create a new provider for our contacts:
```
// contacts-paginator.ts
import { inject, InjectionToken } from '@angular/core';
import { ContactsQuery } from './state/contacts.query';
import { PaginatorPlugin } from '@datorama/akita';

export const CONTACTS_PAGINATOR = new InjectionToken('CONTACTS_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    const contactsQuery = inject(ContactsQuery);
    return new PaginatorPlugin(contactsQuery)
      .withControls().withRange();
  }
});

```
You should already be familiar with the above code. This is the regular process of creating a factory provider in Angular. 

We are creating a `new Paginator()`, passing the query we want to use in our pagination. 
We call withControls(), which will give us an array of pages so we ngFor on them and withRange() which will give us the from and to values to display to the user.

Now, we can use it in our component:
```
// contacts-page.component.ts
import { CONTACTS_PAGINATOR } from '../contacts-paginator';
import { Contact } from '../state/contact.model';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';

@Component({
  templateUrl: './contacts-page.component.html',
})
export class ContactsPageComponent {
  contacts$: Observable<PaginationResponse<Contact>>;

  constructor(@Inject(CONTACTS_PAGINATOR) private paginatorRef: PaginatorPlugin<Contact>,
              private contactsService: ContactsService
              ) { }

  ngOnInit() {
    this.contacts$ = this.paginatorRef.pageChanges.pipe(
      switchMap((page) => {
        const requestFn = () => this.contactsService.get({ page });
        return this.paginatorRef.getPage(requestFn);
      })
    );
  }
}
```
Paginator provides you with a pageChanges observable so you can listen to page changes (which fires the first page immediately) and call the getPage() method, passing the HTTP request. 

Paginator expects to get the following fields as part of the response from the server (in our case, the `request` service method`):
```
{
  "perPage": 10,
  "lastPage": "10",
  "currentPage": "3",
  "total": 150,
  "data": [...]
}
```

In addition to that, Paginator also exposes all the data that you need to display as well as methods for controlling the page from the UI, for example:
`isLoading$`, `isFirst`, `isLast`, `prevPage()`, `nextPage()`, `setPage()`, `isPageActive()`, `pageControls`, etc. 

Let's see how can we use it in the component's template:
```
// contacts-page.component.html
<div>
  <content-loader *ngIf="paginatorRef.isLoading$ | async"></content-loader>

  <ng-container *ngIf="(contacts$ | async) as contacts">
    <section [class.hide]="paginatorRef.isLoading$ | async">
      <table>
        <thead class="thead-dark">
          <tr>...</tr>
        </thead>
        <tbody>
        <tr *ngFor="let contact of contacts.data">
          <th>{{ contact.id }}</th>
          <td>{{ contact.name }}</td>
          <td>{{ contact.email }}</td>
          <td>{{ contact.address }}</td>
        </tr>
        </tbody>
      </table>

      <nav>
        <ul>
          <li [class.disabled]="paginatorRef.isFirst" (click)="paginatorRef.prevPage()">
            <a>Previous</a>
          </li>
          <li [class.active]="paginatorRef.isPageActive(page)"
              (click)="paginatorRef.setPage(page)"
              *ngFor="let page of contacts.pageControls">
            <a>{{ page }}</a>
          </li>
          <li [class.disabled]="paginatorRef.isLast" (click)="paginatorRef.nextPage()">
            <a>Next</a>
          </li>
        </ul>
      </nav>
    </section>

  </ng-container>

</div>
```

That's all you need in order to get fully working pagination including caching.

### Router Integration
There are times where we want to persist the current page in the URL address, for example: `http://app.com/contact?page=3`.
Here is an example of how can we implement it with the plugin:
```
export class ContactsPageComponent {
  contacts$: Observable<PaginationResponse<Contact>>;

  constructor(@Inject(CONTACTS_PAGINATOR) private paginatorRef: PaginatorPlugin<Contact>,
              private contactsService: ContactsService,
              private route: ActivatedRoute
              ) { }

  ngOnInit() {
    this.route.queryParamMap.pipe(
      map(params => +params.get('page')),
      untilDestroyed(this)
    ).subscribe(page => this.paginatorRef.setPage(page));
     
    this.contacts$ = this.paginatorRef.pageChanges.pipe(
      switchMap((page) => {
        const requestFn = () => this.contactsService.get({ page });
        return this.paginatorRef.getPage(requestFn);
      }),
      untilDestroyed(this)
    );
  }
}
```
Each time the `page` query parameter changes, we notify the plugin about the current page.

## Advanced Pagination
There are times where we want to give our users the ability to filter the data, sort it, or change the number of entries per page. The vital step here is that when we change a filter, sort etc., we want to invalidate the cache, because it may alter the server response.

For example, let's add a `sortBy` filter:

```
// contacts-page.component.html
export class ContactsPageComponent {
  contacts$: Observable<PaginationResponse<Contact>>;
  sortByControl = new FormControl('name');

  constructor(@Inject(CONTACTS_PAGINATOR) private paginatorRef: PaginatorPlugin<Contact>,
              private contactsService: ContactsService
              ) { }pag

  ngOnInit() {
    const sortChanges$ = this.sortByControl.valueChanges.pipe(startWith('name'));

    this.contacts$ = combineLatest([
      sortChanges$.pipe(tap(() => this.paginatorRef.clearCache())),
      this.paginatorRef.pageChanges
    ]).pipe(
        switchMap(([sortBy, page]) => {
          const requestFn = () => this.contactsService.get({ page, sortBy });
          return this.paginatorRef.getPage(requestFn);
        })
    );
  }
}
```

When the `sortBy` value changes, we need to invalidate the cache, so the Paginator will know that it needs to re-fetch the data from the server.

## Pagination Metadata
Sometimes you want to save the current filters, so if the user navigates from the current route and comes back you want the filter values to persist. Paginator exposes a metadata property where you can set these values. For example:

```ts
export class ContactsPageComponent {
  ngOnInit() {
    const sortByValue = this.paginatorRef.metadata.get('sortBy') || 'name';
    this.sortByControl = new FormControl(sortByValue);

    const sort$ = this.sortByControl.valueChanges.pipe(startWith(sortByValue));

    this.contacts$ = combineLatest([
      sort$.pipe(tap(() => this.paginatorRef.clearCache())),
      this.paginatorRef.pageChanges
    ]).pipe(
        switchMap(([sortBy, page]) => {
          const requestFn = () => this.contactsService.get({ page, sortBy });
          this.paginatorRef.metadata.set('sortBy', sortBy);
          return this.paginatorRef.getPage(requestFn);
        })
    );
  }
}
```
