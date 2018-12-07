#Filters Plugins
***********************

Sometimes, you need to display a list, and provide users the ability to fiters your list. 
Entity-store give the hability to filter, an sorting, by given options to selectAll() fonction. 
But each time, you want to change this filter, you need to recall the fonction.  

Filters plugins give you the possibility to managed multiples filters, add, remove and update filters, and each time filters as been updated, new filtered value as been emited.

#### Usage 
This could be usefull, to display :

- products list, (with categorie filter, search, price filter etc...)
- Store locator (with filter by region, location etc... )
- portfolio, image gallery
- Any list of element that need multiple filters
- Config filter that could be apply in multiple pages
- ...

#### Advantage : 
- Add multiple filters (dynamically add, remove and update filters) without changing data.

- The filters and the entity query could separated. You could have one components, that display only your element. Is juste make an select, to observe and display all information. 
And have another components to manage all filters. 

- You could also display a list of filters, and permit to delete one. 

- You could set the order to apply all filters 

# Filters Plugins 

## Instantiation 

You need to instanciate the filters Plugins : 

```ts
myFilter = new AkitaFiltersPlugin<MyEntitiesState, MyEntity>(this.myEntitiesQuery);
`


-> Give just the entytiesQuery class to the plugins. 

You could define it in the constructor of your service, and add it to property of your service. 
` constructor(private productsStore: ProductsFiltersStore, private productsQuery: ProductsFiltersQuery, private productsDataService: ProductsFiltersDataService) {
     this.filtersProduct = new AkitaFiltersPlugin<ProductPlantState, ProductPlant>(this.productsQuery);
   }`


## Use 

For getting, elements you need to call the function selectAllByFilters() form your filters plugins instance, instade of using the selectAll() function from your Query Class. 

```ts
myFilter.selectAllByFilters();`

Then add filter 

```ts
myFilter.setFilter({
         id: 'category',
         value: 'garden',
         predicate: (value: ProductPlant, index, array) => value.category === category
       });` 

By adding this filters, the data will be filtered, and the new data will be emited. 

Exemple with Angular, you could add filter for exemple with a component like this. 

```ts 

@Component({
  selector: 'app-category-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="col m2 s6">
      <label>Filter Category</label>
      <div class="input-field col s12">
        <select class="browser-default" [formControl]="categoryControl">
          <option value="" disabled selected>Choose your catgory</option>
          <option value="Interior">Interior</option>
          <option value="Garden">Garden</option>
          <option value="Balcony">Balcony</option>
          <option value="Flowers">Flowers</option>
          <option value="Tree">Tree</option>
          <option value="Roses">Roses</option>
        </select>
      </div>
    </div>
  `
})
export class CategoryFiltersComponent {

  categoryControl: new FormControl();
  
  constructor(private productsService: ProductsFiltersService) {}

  ngOnInit() {
    this.getallFiltersValues();

  // On each changes, set filters 
    this.categoryControl.valueChanges.pipe(untilDestroyed(this)).subscribe(category => {
      this.productsService.setFilter({
        id: 'category',
        value: category,
        predicate: (value: ProductPlant, index, array) => value.category === category
      });
    });
    
    this.filterForm.controls.sortControl.setValue(this.productsService.getFilterValue('category'), { emitEvent: false }); // emit event false, to not emit value in the above value change subscribe
  } 
}
`

# API 

### AkitaFilter type

A Akita filter is an object with the corresponding format :

```ts
type Filter = {
   id: ID;
   /** A corresponding name for display the filter, by default, it will be ${id): ${value}  */
   name?: string;
   /** set the order for filter, by default, it is 10 */
   order?: number;
   /** The filter value, this will be used to compute name, or getting the current value, to initiate your form */
   value?: any;
   /** If you want to have filter that is not displayed on the list */
   hide?: boolean;
   /** The function to apply filters, by default use defaultFilter helpers, that will search the value in the object */
   predicate: (value: any, index: number, array: any[], filter: AkitaFilter) => any;
 };'
 
 - Id and function was mandatored. (By default, Id will guid(), and default function, will be defaultFilter helpers). 
 
 - But you can set a name, that will be usefull to display the filter in the ui. (by default, it will be calculated with ID and value).
 
 - You can set the value, that could be used in your filter function, or to retrieve the value for a filter (in ex to init the form filter)
 
 - Order, coould be usefull, to execute a filter at the begin or the end. (Could be usefull to execute simple filter at the begining, and complexe filter like full search at the end)
 
 - hide : true, it will be applyed and not displayed in the ui. 
 

# filterPlugins API

## Get Entity 
### selectAllByFilters(options: SelectOptions<E> = {}): Observable<E[]>

The main function to subscribe to filtered data. Select All Entity with apply filter to it, and updated with any change (entity or filter)

You can pass same options than selectAll Function in EntityQuery. 

## Manage filters 

### selectFilters(): Observable<AkitaFilter[]>
 
 Select all the filters
  
   Note: filters with hide=true, will not be displayed. If you want it, call directly the filterQuery :
   ```ts
this.filterQuery.selectAll()`
   
### getFilters(): AkitaFilter[]

Get all the current snapshot filters
 Note: filters with hide=true, will not be displayed. If you want it, call directly the filterQuery :
```ts
this.filterQuery.getAll()`

### setFilter(filter: Partial<AkitaFilter>)

Create or update a filter (give a Partial AkitaFilter object)

```ts
filterPlugin.setFilter({
         id: 'fastDelivery',
         name: 'Only fast Delivery',
         value: true,
         order: 1,
         predicate: (value: ProductPlant, index, array) => value.rapidDelivery
       });'

### removeFilter(id: string)

Remove a specified filter. 

### clearFilters() 

Remove all filters. 

### getFilterValue(id: string): any | null 

Get filter value or return null, if value not available. 

Usefull to set init a form value, ex:

```ts
this.filterForm.controls.searchControl.setValue( this.productsService.getFilterValue('search') );`

## Example to display the filters list

```ts 
@Component({
  selector: 'app-list-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div *ngIf="(filters$ | async).length">
    Filter :
  
    <div class="chip" *ngFor="let filter of (filters$ | async)" (click)="removeFilter(filter.id)">
      {{filter.name}}
      <i class="close material-icons">close</i>
    </div>
  
    <a class="waves-effect waves-teal btn-flat" (click)="removeFilterAll()">remove all</a>
  
  </div>
  `
})
export class ListFiltersComponent {

private filters$: Observable<AkitaFilter[]>;
  
  constructor(private productsService: ProductsFiltersService) {}

  ngOnInit() {
    this.filters$ = this.productsService.selectFilters();
  } 
  
   removeFilter(id: any) {
      this.productsService.removeFilter(id);
    }
  
    removeFilterAll() {
      this.productsService.clearFilters();
    }

}

`

## Sorting 

You could also set sorting, that will by applied after filter. Change sorting, will also re-emit new sorted data. 

### setSortBy(order: SortByOptions<E>)

set the sort value 

### getSortValue(): SortByOptions<E> | null

Retrieve the defined sort value, 

## Advanced 

All filter is managed by an EntityStore, if you need to do more you could access it and use all standard api

### filterPlugins.filterStore

get the filter store, It's an Entity store. Be getting the instance, you could do everythings, than EntityStore could done. 
 
### filterPlugins.filterQuery

get the Filter Query. To query the list of your filters. Use the api of EntityFilters. 

### set the filterStore name. 

If you want to use a different filterStore name, you can set it setting params : filtersStoreName when create plugins:
```ts
myFilter = new AkitaFiltersPlugin<MyEntitiesState, MyEntity>(this.myEntitiesQuery, {filtersStoreName: 'newFiltersName'});`

By default, the name will, your 'EntityStoreName' concat with 'Filter'

# Filter helpers Functions

In filter-utils.ts file, their is helper function, to do somme search filters. 

## function defaultFilter<E = any>(inElement: E, index: number, array: E[], filter: Filter) 

Helper function to do a default filter, that will do a search if value is object, or equals otherwise. (only if filter value is defined)

```ts
this.filterForm.controls.search.valueChanges.pipe(untilDestroyed(this)).subscribe((search: string) => {
      if (search) {
        this.productsService.setFilter({
          id: 'search',
          value: search,
          order: 20,
          name: `" ${search} "`,

          predicate: defaultFilter);
      } else {
        this.productsService.removeFilter('search');
      }
    });
`

## function searchFilter(searchKey: string, inObj: Object) 

Helper function to do search on all string element

```ts
this.filterForm.controls.search.valueChanges.pipe(untilDestroyed(this)).subscribe((search: string) => {
      if (search) {
        this.productsService.setFilter({
          id: 'search',
          value: search,
          order: 20,
          name: `" ${search} "`,

          predicate: (value: ProductPlant, index, array) => {
            return searchFilter(search, value);
          }
        });
      } else {
        this.productsService.removeFilter('search');
      }
    });
`

## function searchFilterIn(searchKey: string, inObj: Object, inKey: string) 

Helper function to do search in one string key of an object

```ts
this.filterForm.controls.search.valueChanges.pipe(untilDestroyed(this)).subscribe((search: string) => {
      if (search) {
        this.productsService.setFilter({
          id: 'search',
          value: search,
          order: 20,
          name: `" ${search} "`,

          predicate: (value: ProductPlant, index, array) => {
            return searchFilterIn(search, value, 'name');
          }
        });
      } else {
        this.productsService.removeFilter('search');
      }
    });
`

