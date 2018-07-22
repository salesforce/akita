import { AkitaError } from '../internal/error';
import { __stores__, Actions, rootDispatcher } from '../api/store';
import { globalState } from '../internal/global-state';

export interface PersistStateParams {
  /** The storage key */
  key: string;
  /** Storage strategy to use. This defaults to LocalStorage but you can pass SessionStorage or anything that implements the StorageEngine API. */
  storage: Storage;
  /** Custom deserializer. Defaults to JSON.parse */
  deserialize: Function;
  /** Custom serializer, defaults to JSON.stringify */
  serialize: Function;
  /**
   * By default the whole state is saved to storage, use this param to include only the stores you need.
   * Pay attention that you can't use both include and exclude
   */
  include: string[];
  /**
   *  By default the whole state is saved to storage, use this param to exclude stores that you don't need.
   *  Pay attention that you can't use both include and exclude
   */
  exclude: string[];
}

const defaults: PersistStateParams = {
  key: 'AkitaStores',
  storage: localStorage,
  deserialize: JSON.parse,
  serialize: JSON.stringify,
  include: [],
  exclude: []
};

export function persistState(params?: Partial<PersistStateParams>) {
  const { storage, deserialize, serialize, include, exclude, key } = Object.assign({}, defaults, params);

  const hasInclude = include.length > 0;
  const hasExclude = exclude.length > 0;

  if (hasInclude && hasExclude) {
    throw new AkitaError("You can't use both include and exclude");
  }

  const storageState = deserialize(storage.getItem(key) || '{}');

  /**
   * When we have a new Store, check if we have value in storage and set it.
   */
  const subscription = rootDispatcher.subscribe(action => {
    if (action.type === Actions.NEW_STORE) {
      const store = action.payload.store;
      if (storageState[store.storeName]) {
        globalState.setAction({ type: '@PersistState' });
        store.setState(() => storageState[store.storeName]);
      }
    }

    if (action.type === Actions.NEW_STATE) {
      const storeName = action.payload.name;
      if (action.payload.initialState) {
        return;
      }

      if (hasExclude && exclude.includes(storeName) === true) {
        return;
      }

      if (hasInclude && include.includes(storeName) === false) {
        return;
      }

      let acc = {};

      for (let i = 0, keys = Object.keys(__stores__); i < keys.length; i++) {
        const storeName = keys[i];

        if (hasExclude) {
          if (storeName === storeName && !exclude.includes(storeName)) {
            acc[storeName] = __stores__[storeName]._value();
          }
        } else if (hasInclude) {
          if (storeName === storeName && include.includes(storeName)) {
            acc[storeName] = __stores__[storeName]._value();
          }
        } else {
          acc[storeName] = __stores__[storeName]._value();
        }
      }

      const storageState = deserialize(storage.getItem(key));
      storage.setItem(key, serialize(Object.assign({}, storageState, acc)));
    }
  });

  return {
    destroy() {
      subscription.unsubscribe();
    },
    clear() {
      storage.clear();
    },
    clearStore(storeName: string) {
      const storageState = deserialize(storage.getItem(key) || '{}');

      if (storageState[storeName]) {
        delete storageState[storeName];
        storage.setItem(key, serialize(storageState));
      }
    }
  };
}
