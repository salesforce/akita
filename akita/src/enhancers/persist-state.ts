import { AkitaError } from '../internal/error';
import { __stores__, Actions, rootDispatcher } from '../api/store';
import { skip } from 'rxjs/operators';
import { getValue, setValue } from '../internal/utils';
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

  let stores = {};
  let acc = {};

  function save() {
    storage.setItem(key, serialize(Object.assign({}, storageState, acc)));
  }

  function subscribe(storeName, path) {
    stores[storeName] = __stores__[storeName]
      ._select(state => getValue(state, path))
      .pipe(skip(1))
      .subscribe(data => {
        acc[storeName] = data;
        save();
      });
  }

  function setInitial(storeName, store, path) {
    if (storageState[storeName]) {
      globalState.setAction({ type: '@PersistState' });
      store.setState(state => {
        return setValue(state, path, storageState[storeName]);
      });
    }
  }

  const subscription = rootDispatcher.subscribe(action => {
    if (action.type === Actions.NEW_STORE) {
      let currentStoreName = action.payload.store.storeName;

      if (hasExclude && exclude.indexOf(currentStoreName) > -1 === true) {
        return;
      }

      if (hasInclude) {
        const path = include.find(name => name.indexOf(currentStoreName) > -1);
        if (!path) {
          return;
        } else {
          currentStoreName = path.split('.')[0];
          setInitial(currentStoreName, action.payload.store, path);
          subscribe(currentStoreName, path);
        }
      } else {
        setInitial(currentStoreName, action.payload.store, currentStoreName);
        subscribe(currentStoreName, currentStoreName);
      }
    }
  });

  return {
    destroy() {
      subscription.unsubscribe();
      for (let i = 0, keys = Object.keys(stores); i < keys.length; i++) {
        const storeName = keys[i];
        stores[storeName].unsubscribe();
      }
      stores = {};
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
