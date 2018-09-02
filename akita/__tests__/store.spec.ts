import { AkitaImmutabilityError } from '../src/internal/error';
import { Store } from '../src/api/store';
import { StoreConfig } from '../src/api/store-config';
import { Query } from '../src/api/query';

interface State {
  theme: {
    color: string;
  };
}

const state = {
  theme: {
    color: 'red'
  }
};

@StoreConfig({
  name: 'themes'
})
class ThemeStore extends Store<State> {
  constructor() {
    super(state);
  }
}

const store = new ThemeStore();

describe('Store', () => {
  it('should initialized the store', () => {
    expect(store._value()).toEqual(state);
  });

  it('should select slice from the store', () => {
    const spy = jest.fn();
    store._select(state => state.theme).subscribe(spy);
    expect(spy).toHaveBeenCalledWith({ color: 'red' });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return the store name', () => {
    expect(store.storeName).toEqual('themes');
  });

  it('should return the store value', () => {
    expect(store._value()).toEqual(state);
  });

  it('should set a new state', () => {
    const spy = jest.fn();
    store._select(state => state.theme).subscribe(spy);
    store.setState(state => {
      return {
        ...state,
        theme: {
          color: 'blue'
        }
      };
    });

    expect(spy.mock.calls[0][0]).toEqual({ color: 'red' });
    expect(spy.mock.calls[1][0]).toEqual({ color: 'blue' });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(store._value()).toEqual({
      theme: {
        color: 'blue'
      }
    });
  });

  it('should throw error if the state is the same', () => {
    expect(function() {
      store.setState(state => state);
    }).toThrow(new AkitaImmutabilityError('themes') as any);
  });
});

class User {
  firstName: string = '';
  lastName: string = '';

  constructor(params: Partial<User>) {
    Object.assign(this, params);
  }

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}

@StoreConfig({
  name: 'user'
})
class UserStore extends Store<User> {
  constructor() {
    super(new User({ firstName: '', lastName: '' }));
  }
}

const userStore = new UserStore();

describe('With Class', () => {
  it('should support class', () => {
    expect(userStore._value().name).toEqual(' ');
  });

  it('should support updates', () => {
    userStore.update({ firstName: 'Netanel', lastName: 'Basal' });
    expect(userStore._value() instanceof User).toBeTruthy();
    expect(userStore._value()).toEqual(jasmine.any(User));
    expect(userStore._value().name).toEqual('Netanel Basal');
  });
});

@StoreConfig({
  name: 'user'
})
class TestStore extends Store<User> {
  constructor() {
    super({ config: {}, loading: true });
  }
}

const testStore = new TestStore();
const testQuery = new Query(testStore);

describe('Loading Basic Store', () => {
  it('should support loading', () => {
    let value;
    testQuery.selectLoading().subscribe(v => {
      value = v;
    });
    expect(value).toBeTruthy();
    testStore.setLoading(false);
    expect(value).toBeFalsy();
  });
});
