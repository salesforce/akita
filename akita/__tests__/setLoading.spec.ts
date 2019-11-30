import { EntityStore, QueryEntity } from '../src';
import { setLoading } from '../src/setLoading';
import { timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { cacheable } from '../src/index';

const store = new EntityStore({}, { name: 'test' });
const query = new QueryEntity(store);

jest.useFakeTimers();

describe('setLoading', () => {
  it('should work', () => {
    const log = [];
    const request = timer(1000).pipe(
      setLoading(store),
      tap(() => log.push(1)),
      tap(() => store.set([{ id: 1 }]))
    );

    spyOn(store, 'setLoading').and.callThrough();

    const spy = jest.fn();
    cacheable(store, request).subscribe(spy);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(log.length).toEqual(1);
    expect(query.getValue().loading).toBe(false);
    cacheable(store, request).subscribe(spy);
    // from inside withLoading
    expect(store.setLoading).toBeCalledTimes(2);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(log.length).toEqual(1);

    cacheable(store, request).subscribe(spy);
    // from inside withLoading
    expect(store.setLoading).toBeCalledTimes(2);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(log.length).toEqual(1);
  });
});
