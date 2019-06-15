import { skip, filter } from 'rxjs/operators';
import { from, isObservable, of } from 'rxjs';
import { HashMap, MaybeAsync } from './types';
import { isFunction } from './isFunction';
import { AkitaError } from './errors';
import { __stores__ } from './stores';
import { getValue } from './getValueByString';
import { Actions, setAction } from './actions';
import { setValue } from './setValueByString';
import { rootDispatcher } from './rootDispatcher';
import { isNotBrowser } from './root';
import { isNil } from './isNil';

let skipStorageUpdate = false;

export function setSkipStorageUpdate(skip: boolean) {
  skipStorageUpdate = skip;
}

export function getSkipStorageUpdate() {
  return skipStorageUpdate;
}

export interface PersistStateStorage {
  getItem(key: string): MaybeAsync;

  setItem(key: string, value: any): MaybeAsync;

  clear(): void;
}

function isPromise(v: any) {
  return v && isFunction(v.then);
}

function resolve(asyncOrValue: any) {
  if(isPromise(asyncOrValue) || isObservable(asyncOrValue)) {
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

  preStorageUpdate(storeName: string, state: any): any;

  preStoreUpdate(storeName: string, state: any): any;

  skipStorageUpdate: () => boolean;
}

export function persistState(params?: Partial<PersistStateParams>) {
  if(isNotBrowser) return;

  const defaults: PersistStateParams = {
    key: 'AkitaStores',
    storage: typeof localStorage === 'undefined' ? params.storage : localStorage,
    deserialize: JSON.parse,
    serialize: JSON.stringify,
    include: [],
    exclude: [],
    preStorageUpdate: function(storeName, state) {
      return state;
    },
    preStoreUpdate: function(storeName, state) {
      return state;
    },
    skipStorageUpdate: getSkipStorageUpdate
  };

  const { storage, deserialize, serialize, include, exclude, key, preStorageUpdate, preStoreUpdate, skipStorageUpdate } = Object.assign({}, defaults, params);

  const hasInclude = include.length > 0;
  const hasExclude = exclude.length > 0;
  let includeStores: HashMap<string>;

  if(hasInclude && hasExclude) {
    throw new AkitaError('You can\'t use both include and exclude');
  }

  if(hasInclude) {
    includeStores = include.reduce((acc, path) => {
      const storeName = path.split('.')[0];
      acc[storeName] = path;
      return acc;
    }, {});
  }

  let stores = {};
  let acc = {};
  let subscription;

  const value = storage.getItem(key);
  const buffer = [];

  function _save(v: any) {
    resolve(v).subscribe(() => {
      const next = buffer.shift();
      next && _save(next);
    });
  }

  resolve(value).subscribe((v: any) => {
    const storageState = deserialize(v || '{}');

    function save(storeCache) {
      storageState['$cache'] = { ...(storageState['$cache'] || {}), ...storeCache };
      buffer.push(storage.setItem(key, serialize(Object.assign({}, storageState, acc))));
      _save(buffer.shift());
    }

    function subscribe(storeName, path) {
      stores[storeName] = __stores__[storeName]
        ._select(state => getValue(state, path))
        .pipe(skip(1), filter(() => skipStorageUpdate() === false))
        .subscribe(data => {
          acc[storeName] = preStorageUpdate(storeName, data);
          Promise.resolve().then(() => save({ [storeName]: __stores__[storeName]._cache().getValue() }));
        });
    }

    function setInitial(storeName, store, path) {
      if(storeName in storageState) {
        setAction('@PersistState');
        store._setState(state => {
          return setValue(state, path, preStoreUpdate(storeName, storageState[storeName]));
        });
        const hasCache = storageState['$cache'] ? storageState['$cache'][storeName] : false;
        __stores__[storeName].setHasCache(hasCache);
        if(store.setDirty) {
          store.setDirty();
        }
      }
    }

    subscription = rootDispatcher.pipe(filter(({ type }) => type === Actions.NEW_STORE)).subscribe(action => {
      let currentStoreName = action.payload.store.storeName;

      if(hasExclude && exclude.includes(currentStoreName)) {
        return;
      }

      if(hasInclude) {
        const path = includeStores[currentStoreName];
        if(!path) {
          return;
        }
        setInitial(currentStoreName, action.payload.store, path);
        subscribe(currentStoreName, path);
      } else {
        setInitial(currentStoreName, action.payload.store, currentStoreName);
        subscribe(currentStoreName, currentStoreName);
      }
    });
  });

  return {
    destroy() {
      subscription.unsubscribe();
      for(let i = 0, keys = Object.keys(stores); i < keys.length; i++) {
        const storeName = keys[i];
        stores[storeName].unsubscribe();
      }
      stores = {};
    },
    clear() {
      storage.clear();
    },
    clearStore(storeName?: string) {
      if(isNil(storeName)) {
        const value = resolve(storage.setItem(key, '{}'));
        value.subscribe();
        return;
      }
      const value = storage.getItem(key);
      resolve(value).subscribe(v => {
        const storageState = deserialize(v || '{}');

        if(storageState[storeName]) {
          delete storageState[storeName];
          const value = resolve(storage.setItem(key, serialize(storageState)));
          value.subscribe();
        }
      });
    }
  };
}

