# Breaking Changes

## 7.0.0
- Akita now complied with `target: ES2020`.
- Remove coupling to Angular by removing the `ngOnDestroy` method from the store. If you're using a store inside
a component's provider, you need to call it manually:

```ts
@Injectable()
class TodosStore {
  constructor(private store: TodosStore) {}
 
  ngOnDestroy() {
    this.store.destroy();
  }
}
```

- All Angular packages peer dependency is Angular v13.
- Remove the `effects` package in favor of [ngneat/effects](https://github.com/ngneat/effects#use-with-angular)

## 6.0.0

- Upgrade to TS v4 and support tslib v2.0
- New effects package

## 5.0.0

- Updated `QueryEntity` typing of `select` / `get` methods to respect `undefined` entity values.
- Remove deprecated array utils functions.
- Remove deprecated `exclude` option from persist state. Use `include` with a callback option.
- The `upsert` operator of `EntityStore` now accepts an explicit entity initialization callback that'll be used as the initial value of the entity if it doesn't exist. ( this isn't a breaking change )

```ts
store.upsert(
  [2, 3],
  (entity) => ({ isOpen: !(entity?.isOpen ?? true) }),
  (id, newState) => ({ id, ...newState, enabled: true })
);
```

- The `runStoreAction` is rewritten as well to support type safe entity operations:

```ts
// Before
runStoreAction('books', StoreActions.UpsertEntities, {
  payload: {
    data: { title: 'New Title' },
    entityIds: [2, 3],
  },
});
```

```ts
// After
runEntityStoreAction(BooksStore, EntityStoreAction.UpsertEntities, (upsert) => upsert([2, 3], { title: 'New Title' }, (id, newState) => ({ id, ...newState, price: 0 })));
```

It also takes the store name as string.

- A new [select](https://datorama.github.io/akita/docs/enhancers/persist-state/#select) option for the `persistState` plugin.

## 4.0.0

Most of the breaking changes in this version are related to types changes.

- EntityStore and QueryEntity now don't require the second generic entity type:

```ts
// Before
export interface ProductsState extends EntityState<Product> {}

@StoreConfig({ name: 'products' })
export class ProductsStore extends EntityStore<ProductsState, Product> {
  constructor() { super();
}

export class ProductsQuery extends QueryEntity<ProductsState, Product> {
  constructor(protected store: ProductsStore) {
    super(store);
  }
}

// After
export interface ProductsState extends EntityState<Product> {}

@StoreConfig({ name: 'products' })
export class ProductsStore extends EntityStore<ProductsState> {
  constructor() { super();
}

export class ProductsQuery extends QueryEntity<ProductsState> {
  constructor(protected store: ProductsStore) {
    super(store);
  }
}
```

For now, we keep a deprecated generic, so it will not break any existing code, but please, don't use it anymore.

- Removed the unused error state type - `EntityState<Product, StateErrorType>`.
- Custom ID type location is changed:

```ts
// Before:
export interface ProductsState extends EntityState<Product> {}

@StoreConfig({ name: 'products' })
export class ProductsStore extends EntityStore<ProductsState, Product, string> {
  constructor() { super();
}

// After
export interface ProductsState extends EntityState<Product, string> {}

@StoreConfig({ name: 'products' })
export class ProductsStore extends EntityStore<ProductsState> {
  constructor() { super();
}
```

- Removed deprecated `selectUpdatedEntityIds` method in favor of `selectEntityAction`.
- Removed deprecated `waitForTransaction` method in favor of `auditTime`.
- The default entity id type changed from `ID` which was `number | string` to `any`. We now recommend to strict your type in the second `EntityState` generic parameter.

### Plugins

Entity plugins now require one generic, which is the store's type instead of the entity type.

- `new EntityDirtyCheckPlugin<WidgetsState>`
- `new EntityStateHistoryPlugin<WidgetsState>`
- `new PaginatorPlugin<WidgetsState>`

### Things you might have missed

- Firebase [integration](https://netbasal.gitbook.io/akita/angular-plugins/firebase-integration).
- In dev mode, you can now use `window.$$stores` and `window.$$queries` to obtain a reference to the stores or the queries.
- persistState plugin performance optimization [option](https://netbasal.gitbook.io/akita/enhancers/persist-state#performance-optimization).
- persistState plugin custom hooks [support](https://netbasal.gitbook.io/akita/enhancers/persist-state#custom-hooks).
- Add a `replace` method to EntityStore.
- PaginatorPlugin add a `refreshCurrentPage` method.
- HistoryPlugin add a custom clear function.
- selectEntity now support predicate function - `query.selectEntity(e => e.title === 'title')`.
- Add Entity Actions [API](https://netbasal.gitbook.io/akita/entity-store/entity-query/api#entity-actions).
- `StoreConfig` can take a custom deep freeze function.

## 3.0.0

- `EntityStore.set()` - remove `options` param, i.e `entityClass`..
- Remove `EntityStore.createOrReplace()` in favor of `EntityStore.upsert()`.
- Remove `EntityStore.updateRoot()` in favor of `EntityStore.update()`.
- Remove `EntityStore.updateAll()` in favor of `EntityStore.update(null, newState)`,
- `Store.setState` is internal and changed to `_setState()` - use only the `update()` method.
- Remove `mapWorker`.
- Remove array helpers.
- Remove `decrement` and `increment` functions.
- Remove `Query.selectOnce` - use `select().pipe(take(1))`.
- Remove deprecated `Query.getSnapshot()`.
- Remove `noop` - use the `of()` observable.
- Remove `isPristine` and `isDirty` in favor of new `caching` functionality.
- The `action` decorator takes the action name instead of an object.
- Remove `EntityStore.isEmpty` in favor of `EntityStore.hasEntity()`.

## 2.0.0

- Update typescript to v3.2.
- Remove the `getInitialActiveState()` function.
- Entity dirty check plugin: remove deprecated `isSomeDirty` and `someDirty`.

#### Miscellaneous

- Deprecate `getSnapshot()` in favor of `getValue()`.
- Remove redundant `options` param from `selectMulti`,
- When using the `active` functionality always add the initial `active` state. For single:

```ts
export interface State extends EntityState<Widget>, ActiveState {}

const initialState = {
  active: null,
};

@StoreConfig({ name: 'widgets' })
export class WidgetsStore extends EntityStore<WidgetsState, Widget> {
  constructor() {
    super(initialState);
  }
}
```

And for multi:

```ts
export interface State extends EntityState<Widget>, MultiActiveState {}

const initialState = {
  active: [],
};

@StoreConfig({ name: 'widgets' })
export class WidgetsStore extends EntityStore<WidgetsState, Widget> {
  constructor() {
    super(initialState);
  }
}
```

#### Features

- Add support for multiple active entities 🎉
- `filterNil` operator strongly typed
- `selectFirst` and `selectLast` selectors
