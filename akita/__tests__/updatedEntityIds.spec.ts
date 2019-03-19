import { WidgetsQuery, WidgetsStore } from './setup';
import { take } from 'rxjs/operators';

const store = new WidgetsStore();
const query = new WidgetsQuery(store);

describe('updatedEntityIds', () => {
  it('should emit empty array on init', () => {
    const spy = jest.fn();
    query
      .selectUpdatedEntityIds()
      .pipe(take(1))
      .subscribe(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith([]);
  });

  it('should emit the ids upon update', () => {
    const spy = jest.fn();
    store.add([{ id: 1, title: '1' }, { id: 2, title: '2' }]);
    query.selectUpdatedEntityIds().subscribe(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith([]);
    store.update(1, { title: 'update' });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toBeCalledWith([1]);
    store.update(1, { title: 'update2' });
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toBeCalledWith([1]);
    store.update([1, 2], { title: 'updated' });
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toBeCalledWith([1, 2]);
  });
});
