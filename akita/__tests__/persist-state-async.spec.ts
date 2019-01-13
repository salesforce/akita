import { timer } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { StoreConfig } from '../src/api/store-config';
import { Store } from '../src/api/store';
import { PersistStateStorage, persistState } from '../src/enhancers/persist-state';

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

jest.useFakeTimers();

let cache = {};

const asyncStorage: PersistStateStorage = {
  getItem(key) {
    return timer(random(1000, 3000)).pipe(mapTo(cache[key]));
  },
  setItem(key, value) {
    return timer(random(1000, 10000)).pipe(tap(() => (cache[key] = value)));
  },
  clear() {
    cache = {};
  }
};

persistState({ storage: asyncStorage });

@StoreConfig({
  name: 'auth'
})
class AuthStore extends Store<any> {
  constructor() {
    super({});
  }
}

const store = new AuthStore();

describe('Persist state async', () => {
  it('should work with async', () => {
    store.update({
      async: true
    });
    jest.runAllTimers();
    store.update({
      async: false
    });
    jest.runAllTimers();
    store.update({
      async: true
    });
    jest.runAllTimers();
    store.update({
      async: false
    });
    jest.runAllTimers();
    store.update({
      async: true
    });
    jest.runAllTimers();
    store.update({
      async: false
    });
    jest.runAllTimers();
    expect(JSON.parse(cache['AkitaStores']).auth.async).toBeFalsy();
  });
});
