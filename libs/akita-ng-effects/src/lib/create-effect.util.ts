import { Observable } from 'rxjs';
import { setMetadata } from './effect.utils';

export function createEffect<T>(actions$: () => Observable<T>): Observable<T> {
  const effect = actions$();
  setMetadata(effect, null);

  return effect;
}
