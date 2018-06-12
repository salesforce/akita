import { memoizeOne } from '../src/api/memoize';

describe('MemoizeOne', () => {
  let spy;

  beforeEach(() => {
    spy = jest.fn((ids, entities) => {});
  });

  it('should NOT call when ids or entities does not change', () => {
    const memo = memoizeOne(spy);
    const ids = [1, 2];
    const entities = { 1: {}, 2: {} };
    memo(ids, entities);
    expect(spy).toHaveBeenCalledTimes(1);
    memo(ids, entities);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call when ids does change', () => {
    const memo = memoizeOne(spy);
    const ids = [1, 2];
    const entities = { 1: {}, 2: {} };
    memo(ids, entities);
    expect(spy).toHaveBeenCalledTimes(1);
    memo([1], entities);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should call when entities does change', () => {
    const memo = memoizeOne(spy);
    const ids = [1, 2];
    const entities = { 1: {}, 2: {} };
    memo(ids, entities);
    expect(spy).toHaveBeenCalledTimes(1);
    memo(ids, {});
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should call when both change', () => {
    const memo = memoizeOne(spy);
    const ids = [1, 2];
    const entities = { 1: {}, 2: {} };
    memo(ids, entities);
    expect(spy).toHaveBeenCalledTimes(1);
    memo([], {});
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
