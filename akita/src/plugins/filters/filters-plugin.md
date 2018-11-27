#Filters Plugins
***********************

Sometimes, you need to display a list, and provide users the ability to fiters your list. 
Entity-store give the hability to filter, an sorting, by given options to selectAll() fonction. 
But each time, you want to change this filter, you need to recall the fonction, and you can't apply a more than one filter.  

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

You need to instanciate the filtersPlugins : 

`myFilter = new FiltersPlugin<MyEntitiesState, MyEntity>(this.myEntitiesQuery);`

-> Give just the entytiesQuery class to the plugins. 

You could define it in the constructor of your service, and add it to property of your service. 
` constructor(private productsStore: ProductsFiltersStore, private productsQuery: ProductsFiltersQuery, private productsDataService: ProductsFiltersDataService) {
     this.filtersProduct = new FiltersPlugin<ProductPlantState, ProductPlant>(this.productsQuery);
   }`


## Use 

For getting, elements you need to call the function selectAllByFilter() form your filters plugins instance, instade of using the selectAll() function from your Query Class. 

`myFilter.selectAllByFilter();`

Then add filter 

`myFilter.setFilter({
         id: 'category',
         value: category,
         function: (value: ProductPlant, index, array) => value.category === category
       });` 

By adding this filters, the data will be filtered, and the new data will be emited. 



# API 

### Filter type

A filter is an object with the corresponding format :

'type Filter = {
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
   function: (value: any, index: number, array: any[], filter: Filter) => any;
 };'
 
 - Id and function was mandatored. (By default, Id will guid(), and default function, will be defaultFilter helpers). 
 
 - But you can set a name, that will be usefull to display the filter in the ui. (by default, it will be calculated with ID and value).
 
 - You can set the value, that could be used in your filter function, or to retrieve the value for a filter (in ex to init the form filter)
 
 - Order, coould be usefull, to execute a filter at the begin or the end. (Could be usefull to execute simple filter at the begining, and complexe filter like full search at the end)
 
 - hide : true, it will be applyed and not displayed in the ui. 
 

# filterPlugins API

## Get Entity 
### selectAllByFilter(options: SelectOptions<E> = {}): Observable<E[]>

The main function to subscribe to filtered data. Select All Entity with apply filter to it, and updated with any change (entity or filter)

You can pass same options than selectAll Function in EntityQuery. 

## Manage filters 

### selectFilters(): Observable<E[]>
 
 Select all the filters
  
   Note: filters with hide=true, will not be displayed. If you want it, call directly the filterQuery :
   `this.filterQuery.selectAll()`
   
### getFilters(): E[]

Get all the current snapshot filters
 Note: filters with hide=true, will not be displayed. If you want it, call directly the filterQuery :
`this.filterQuery.getAll()`

### setFilter(filter: Partial<Filter>)

Create or update a filter (give a Partial Filter object)

'filterPlugin.setFilter({
         id: 'fastDelivery',
         name: 'Only fast Delivery',
         value: this.filterFastDelivery,
         order: 1,
         function: (value: ProductPlant, index, array) => value.rapidDelivery
       });'

### removeFilter(id: string)

Remove a specified filter. 

### cleanFilters() 

Remove all filters. 

### getFilterValue(id: string): any | null 

Get filter value or return null, if value not available. 

Usefull to set init a form value, ex:

`this.filterForm.controls.searchControl.setValue( this.productsService.getFilterValue('search') );`


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
`myFilter = new FiltersPlugin<MyEntitiesState, MyEntity>(this.myEntitiesQuery, {filtersStoreName: 'newFiltersName'});`

By default, the name will, your 'EntityStoreName' concat with 'Filter'

# Filter helpers Functions

In filter-utils.ts file, their is helper function, to do somme search filters. 

## function defaultFilter<E = any>(inElement: E, index: number, array: E[], filter: Filter) 

Helper function to do a default filter, that will do a search if value is object, or equals otherwise. (only if filter value is defined)

## function searchFilter(searchKey: string, inObj: Object) 

Helper function to do search on all string element

## function searchFilterIn(searchKey: string, inObj: Object, inKey: string) 

Helper function to do search in one string key of an object

