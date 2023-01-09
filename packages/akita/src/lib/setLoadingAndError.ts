import { defer, MonoTypeOperatorFunction, Observable, tap } from 'rxjs';
import { Store } from './store';

export function setLoadingAndError<T>(store: Store): MonoTypeOperatorFunction<T> {
  return function <T>(source: Observable<T>) {
    return defer(() => {
      store.setLoading(true);
      store.setError(null);

      return source.pipe(
        tap({
          error(err) {
            store.setLoading(false);
            store.setError(err);
          },
          complete() {
            store.setLoading(false);
          },
        })
      );
    });
  };
}
