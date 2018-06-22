import { AkitaError } from '../internal/error';
import { __registerStore__, __rootDispatcher__, __stores__, Store } from '../api/store';
import { denormalizeStoreName, normalizeStoreName } from '../internal/utils';

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
  let initializedStores: { [storeName: string]: boolean } = {};

  if (hasInclude && hasExclude) {
    throw new AkitaError("You can't use both include and exclude");
  }

  const storageState = deserialize(storage.getItem(key) || '{}');

  /**
   * When we have a new Store, check if we have value in storage and set it.
   */
  const subOne = __registerStore__.subscribe((store: Store<any>) => {
    if (storageState[store.storeName]) {
      initializedStores[store.storeName] = true;
      store.setState(() => storageState[store.storeName]);
    }
  });

  const subTwo = __rootDispatcher__.subscribe(_storeName => {
    if (initializedStores[_storeName]) {
      initializedStores[_storeName] = false;
    } else {
      let acc = {};

      for (let i = 0, keys = Object.keys(__stores__); i < keys.length; i++) {
        const storeName = keys[i];
        /** ProductsStore => products */
        const normalizeName = normalizeStoreName(storeName);
        if (hasExclude) {
          if (storeName === _storeName && !exclude.includes(normalizeName)) {
            acc[storeName] = __stores__[storeName]._value();
          }
        } else if (hasInclude) {
          if (storeName === _storeName && include.includes(normalizeName)) {
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
      subOne.unsubscribe();
      subTwo.unsubscribe();
    },
    clear() {
      storage.clear();
    },
    clearStore(storeName: string) {
      const storageState = deserialize(storage.getItem(key) || '{}');
      const normalizeName = denormalizeStoreName(storeName);

      if (storageState[normalizeName]) {
        delete storageState[normalizeName];
        storage.setItem(key, serialize(storageState));
      }
    }
  };
}
