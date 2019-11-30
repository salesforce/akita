import { Store } from './store';
import { Observable, defer } from 'rxjs';
import { finalize } from 'rxjs/operators';

export function setLoading(store: Store) {
  return function<T>(source: Observable<T>) {
    return defer(() => {
      store.setLoading(true);
      return source.pipe(finalize(() => store.setLoading(false)));
    });
  };
}
