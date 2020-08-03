import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { isEqualByKeys } from '../isEqualByKeys';

/**
 * Compare current and previous emitted values by its content.
 */
export function remember<T>() {
  let prev: T | undefined;
  return (source: Observable<T>) =>
    source.pipe(
      filter((curr) => !isEqualByKeys(prev, curr)),
      tap((curr) => (prev = curr))
    );
}
