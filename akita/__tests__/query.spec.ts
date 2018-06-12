import { Store } from '../src/api/store';
import { Query } from '../src/api/query';

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

class UserStore extends Store<User> {
  constructor() {
    super(new User({ firstName: 'Netanel', lastName: 'Basal' }));
  }
}

const userStore = new UserStore();

class UserQuery extends Query<User> {
  constructor() {
    super(userStore);
  }
}

const query = new UserQuery();

describe('With Class', () => {
  it('should select', () => {
    const spy = jest.fn();
    query.select(state => state.firstName).subscribe(spy);
    expect(spy).toHaveBeenCalledWith('Netanel');
  });

  it('should select once', () => {
    const spy = jest.fn();
    query.selectOnce(state => state.firstName).subscribe(spy);
    userStore.update({
      firstName: 'Angular'
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get the value', () => {
    expect(query.getSnapshot()).toEqual(userStore._value());
  });
});
