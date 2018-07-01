import { Store } from '../src/api/store';
import { Query } from '../src/api/query';
import { StateHistory } from '../src/plugins/state-history';

interface State {
  counter: number;
}

class CounterStore extends Store<State> {
  constructor() {
    super({ counter: 0 });
  }
}

class CounterQuery extends Query<State> {
  constructor(protected store) {
    super(store);
  }
}

const store = new CounterStore();
const query = new CounterQuery(store);
const stateHistory = new StateHistory(query);

describe('StateHistory', () => {
  it('should set the current state', () => {
    expect(stateHistory.history).toEqual({
      past: [],
      present: { counter: 0 },
      future: []
    });
  });

  it('should work', () => {
    expect(stateHistory.hasPast).toBeFalsy();
    expect(stateHistory.hasFuture).toBeFalsy();

    store.setState(state => {
      return {
        counter: state.counter + 1
      };
    });

    expect(stateHistory.history).toEqual({
      past: [{ counter: 0 }],
      present: { counter: 1 },
      future: []
    });

    expect(stateHistory.hasPast).toBeTruthy();
    expect(stateHistory.hasFuture).toBeFalsy();

    store.setState(state => {
      return {
        counter: state.counter + 1
      };
    });

    expect(stateHistory.history).toEqual({
      past: [{ counter: 0 }, { counter: 1 }],
      present: { counter: 2 },
      future: []
    });

    expect(stateHistory.hasPast).toBeTruthy();
    expect(stateHistory.hasFuture).toBeFalsy();

    stateHistory.undo();

    expect(stateHistory.history).toEqual({
      past: [{ counter: 0 }],
      present: { counter: 1 },
      future: [{ counter: 2 }]
    });

    expect(stateHistory.hasPast).toBeTruthy();
    expect(stateHistory.hasFuture).toBeTruthy();

    stateHistory.undo();

    expect(stateHistory.history).toEqual({
      past: [],
      present: { counter: 0 },
      future: [{ counter: 1 }, { counter: 2 }]
    });

    expect(stateHistory.hasPast).toBeFalsy();
    expect(stateHistory.hasFuture).toBeTruthy();

    stateHistory.redo();

    expect(stateHistory.history).toEqual({
      past: [{ counter: 0 }],
      present: { counter: 1 },
      future: [{ counter: 2 }]
    });

    expect(stateHistory.hasPast).toBeTruthy();
    expect(stateHistory.hasFuture).toBeTruthy();

    stateHistory.redo();

    expect(stateHistory.history).toEqual({
      past: [{ counter: 0 }, { counter: 1 }],
      present: { counter: 2 },
      future: []
    });

    expect(stateHistory.hasPast).toBeTruthy();
    expect(stateHistory.hasFuture).toBeFalsy();

    store.setState(state => {
      return {
        counter: state.counter + 1
      };
    });

    store.setState(state => {
      return {
        counter: state.counter + 1
      };
    });

    store.setState(state => {
      return {
        counter: state.counter + 1
      };
    });

    expect(stateHistory.history).toEqual({
      past: [{ counter: 0 }, { counter: 1 }, { counter: 2 }, { counter: 3 }, { counter: 4 }],
      present: { counter: 5 },
      future: []
    });

    stateHistory.jumpToPast(1);

    expect(stateHistory.history).toEqual({
      past: [{ counter: 0 }],
      present: { counter: 1 },
      future: [{ counter: 2 }, { counter: 3 }, { counter: 4 }]
    });

    stateHistory.jumpToFuture(1);

    expect(stateHistory.history).toEqual({
      past: [{ counter: 0 }, { counter: 2 }],
      present: { counter: 3 },
      future: [{ counter: 4 }]
    });
  });
});

const store2 = new CounterStore();
const query2 = new CounterQuery(store2);
const stateHistory2 = new StateHistory(query2, 1);

describe('StateHistory - Limit', () => {
  store2.setState(state => {
    return {
      counter: state.counter + 1
    };
  });

  store2.setState(state => {
    return {
      counter: state.counter + 1
    };
  });

  store2.setState(state => {
    return {
      counter: state.counter + 1
    };
  });

  store2.setState(state => {
    return {
      counter: state.counter + 1
    };
  });

  store2.setState(state => {
    return {
      counter: state.counter + 1
    };
  });

  store2.setState(state => {
    return {
      counter: state.counter + 1
    };
  });

  store2.setState(state => {
    return {
      counter: state.counter + 1
    };
  });

  expect(stateHistory2.history).toEqual({ past: [{ counter: 6 }], present: { counter: 7 }, future: [] });
});
