# Breaking Changes

## 3.0.0
https://github.com/datorama/akita/issues/175#issue-412798235

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
