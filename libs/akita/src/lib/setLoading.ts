import { defer, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Store } from './store';

export function setLoading<T>(store: Store): MonoTypeOperatorFunction<T> {
  return function <T>(source: Observable<T>) {
    return defer(() => {
      store.setLoading(true);
      return source.pipe(finalize(() => store.setLoading(false)));
    });
  };
}
