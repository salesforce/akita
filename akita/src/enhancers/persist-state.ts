import { AkitaError } from '../internal/error';
import { __stores__, Actions, rootDispatcher } from '../api/store';
import { skip } from 'rxjs/operators';
import { getValue, isFunction, setValue } from '../internal/utils';
import { __globalState } from '../internal/global-state';
import { from, isObservable, of } from 'rxjs';
import { MaybeAsync } from '../api/types';

const notBs = typeof localStorage === 'undefined';

export interface PersistStateStorage {
  getItem(key: string): MaybeAsync;

  setItem(key: string, value: any): MaybeAsync;

  clear(): void;
}

function isPromise(v) {
  return v && isFunction(v.then);
}

function resolve(asyncOrValue) {
  if (isPromise(asyncOrValue) || isObservable(asyncOrValue)) {
    return from(asyncOrValue);
  }

  return of(asyncOrValue);
}

export interface PersistStateParams {
  /** The storage key */
  key: string;
  /** Storage strategy to use. This defaults to LocalStorage but you can pass SessionStorage or anything that implements the StorageEngine API. */
  storage: PersistStateStorage;
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

export function persistState(params?: Partial<PersistStateParams>) {
  if (notBs) return;

  const defaults: PersistStateParams = {
    key: 'AkitaStores',
    storage: localStorage,
    deserialize: JSON.parse,
    serialize: JSON.stringify,
    include: [],
    exclude: []
  };
  const { storage, deserialize, serialize, include, exclude, key } = Object.assign({}, defaults, params);

  const hasInclude = include.length > 0;
  const hasExclude = exclude.length > 0;

  if (hasInclude && hasExclude) {
    throw new AkitaError("You can't use both include and exclude");
  }
  let stores = {};
  let acc = {};
  let subscription;

  const value = storage.getItem(key);
  const buffer = [];

  function _save(v) {
    resolve(v).subscribe(() => {
      const next = buffer.shift();
      next && _save(next);
    });
  }

  resolve(value).subscribe(v => {
    const storageState = deserialize(v || '{}');

    function save() {
      buffer.push(storage.setItem(key, serialize(Object.assign({}, storageState, acc))));
      _save(buffer.shift());
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
        __globalState.setAction({ type: '@PersistState' });
        store.setState(state => {
          return setValue(state, path, storageState[storeName]);
        });
        if (store.setDirty) {
          store.setDirty();
        }
      }
    }

    subscription = rootDispatcher.subscribe(action => {
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
      const value = storage.getItem(key);
      resolve(value).subscribe(v => {
        const storageState = deserialize(v || '{}');

        if (storageState[storeName]) {
          delete storageState[storeName];
          const value = resolve(storage.setItem(key, serialize(storageState)));
          value.subscribe();
        }
      });
    }
  };
}
