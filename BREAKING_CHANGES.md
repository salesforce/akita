# Breaking Changes

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
export interface State extends EntityState<Widget>, ActiveState {
}

const initialState = {
  active: null
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
export interface State extends EntityState<Widget>, MultiActiveState {
}

const initialState = {
  active: []
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
