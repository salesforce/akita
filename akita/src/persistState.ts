import { filter, skip } from 'rxjs/operators';
import { from, isObservable, of, OperatorFunction, ReplaySubject, Subscription } from 'rxjs';
import { HashMap, MaybeAsync } from './types';
import { isFunction } from './isFunction';
import { AkitaError } from './errors';
import { __stores__ } from './stores';
import { getValue } from './getValueByString';
import { setAction } from './actions';
import { setValue } from './setValueByString';
import { $$addStore, $$deleteStore } from './dispatchers';
import { isNil } from './isNil';
import { isObject } from './isObject';
import { isNotBrowser } from './root';

let skipStorageUpdate = false;

const _persistStateInit = new ReplaySubject(1);

export function selectPersistStateInit() {
  return _persistStateInit.asObservable();
}

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

function observify(asyncOrValue: any) {
  if (isPromise(asyncOrValue) || isObservable(asyncOrValue)) {
    return from(asyncOrValue);
  }

  return of(asyncOrValue);
}

export interface PersistStateParams {
  /** The storage key */
  key: string;
  /** Whether to enable persistState in a non-browser environment */
  enableInNonBrowser: boolean;
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
  include: (string | ((storeName: string) => boolean))[];
  /**
   *  By default the whole state is saved to storage, use this param to exclude stores that you don't need.
   *  Pay attention that you can't use both include and exclude
   */
  exclude: string[];

  preStorageUpdate(storeName: string, state: any): any;

  preStoreUpdate(storeName: string, state: any): any;

  skipStorageUpdate: () => boolean;
  preStorageUpdateOperator: () => OperatorFunction<any, any>;
  /** Whether to persist a dynamic store upon destroy */
  persistOnDestroy: boolean;
}

export function persistState(params?: Partial<PersistStateParams>) {
  const defaults: PersistStateParams = {
    key: 'AkitaStores',
    enableInNonBrowser: false,
    storage: typeof localStorage === 'undefined' ? params.storage : localStorage,
    deserialize: JSON.parse,
    serialize: JSON.stringify,
    include: [],
    // @deprecated
    exclude: [],
    persistOnDestroy: false,
    preStorageUpdate: function(storeName, state) {
      return state;
    },
    preStoreUpdate: function(storeName, state) {
      return state;
    },
    skipStorageUpdate: getSkipStorageUpdate,
    preStorageUpdateOperator: () => source => source
  };

  const { storage, enableInNonBrowser, deserialize, serialize, include, exclude, key, preStorageUpdate, persistOnDestroy, preStorageUpdateOperator, preStoreUpdate, skipStorageUpdate } = Object.assign(
    {},
    defaults,
    params
  );

  if (isNotBrowser && !enableInNonBrowser) return;

  const hasInclude = include.length > 0;
  const hasExclude = exclude.length > 0;
  let includeStores: { fns: Function[]; [key: string]: Function[] | string };

  if (hasInclude && hasExclude) {
    throw new AkitaError("You can't use both include and exclude");
  }

  if (hasInclude) {
    includeStores = include.reduce(
      (acc, path) => {
        if (isFunction(path)) {
          acc.fns.push(path);
        } else {
          const storeName = path.split('.')[0];
          acc[storeName] = path;
        }
        return acc;
      },
      { fns: [] }
    );
  }

  let stores: HashMap<Subscription> = {};
  let acc = {};
  let subscriptions: Subscription[] = [];

  const buffer = [];

  function _save(v: any) {
    observify(v).subscribe(() => {
      const next = buffer.shift();
      next && _save(next);
    });
  }

  // when we use the local/session storage we perform the serialize, otherwise we let the passed storage implementation to do it
  const isLocalStorage = typeof localStorage !== 'undefined' && (storage === localStorage || storage === sessionStorage);

  observify(storage.getItem(key)).subscribe((value: any) => {
    let storageState = isObject(value) ? value : deserialize(value || '{}');

    function save(storeCache) {
      storageState['$cache'] = { ...(storageState['$cache'] || {}), ...storeCache };
      storageState = Object.assign({}, storageState, acc);

      buffer.push(storage.setItem(key, isLocalStorage ? serialize(storageState) : storageState));
      _save(buffer.shift());
    }

    function subscribe(storeName, path) {
      stores[storeName] = __stores__[storeName]
        ._select(state => getValue(state, path))
        .pipe(
          skip(1),
          filter(() => skipStorageUpdate() === false),
          preStorageUpdateOperator()
        )
        .subscribe(data => {
          acc[storeName] = preStorageUpdate(storeName, data);
          Promise.resolve().then(() => save({ [storeName]: __stores__[storeName]._cache().getValue() }));
        });
    }

    function setInitial(storeName, store, path) {
      if (storeName in storageState) {
        setAction('@PersistState');
        store._setState(state => {
          return setValue(state, path, preStoreUpdate(storeName, storageState[storeName]));
        });
        const hasCache = storageState['$cache'] ? storageState['$cache'][storeName] : false;
        __stores__[storeName].setHasCache(hasCache, { restartTTL: true });
      }
    }

    subscriptions.push(
      $$deleteStore.subscribe(storeName => {
        if (stores[storeName]) {
          if (persistOnDestroy === false) {
            save({ [storeName]: false });
          }
          stores[storeName].unsubscribe();
          delete stores[storeName];
        }
      })
    );

    subscriptions.push(
      $$addStore.subscribe(storeName => {
        if (hasExclude && exclude.includes(storeName)) {
          return;
        }

        const store = __stores__[storeName];
        if (hasInclude) {
          let path = includeStores[storeName];

          if (!path) {
            const passPredicate = includeStores.fns.some(fn => fn(storeName));
            if (passPredicate) {
              path = storeName;
            } else {
              return;
            }
          }
          setInitial(storeName, store, path);
          subscribe(storeName, path);
        } else {
          setInitial(storeName, store, storeName);
          subscribe(storeName, storeName);
        }
      })
    );

    _persistStateInit.next();
  });

  return {
    destroy() {
      subscriptions.forEach(s => s.unsubscribe());
      for (let i = 0, keys = Object.keys(stores); i < keys.length; i++) {
        const storeName = keys[i];
        stores[storeName].unsubscribe();
      }
      stores = {};
    },
    clear() {
      storage.clear();
    },
    clearStore(storeName?: string) {
      if (isNil(storeName)) {
        const value = observify(storage.setItem(key, '{}'));
        value.subscribe();
        return;
      }
      const value = storage.getItem(key);
      observify(value).subscribe(v => {
        const storageState = deserialize(v || '{}');

        if (storageState[storeName]) {
          delete storageState[storeName];
          const value = observify(storage.setItem(key, serialize(storageState)));
          value.subscribe();
        }
      });
    }
  };
}
