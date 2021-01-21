import { Observable } from 'rxjs';
import { setMetadata } from './effect.utils';
import { EffectOptions } from './types';

export function createEffect<T>(actions$: () => Observable<T>, options?: EffectOptions): Observable<T> {
  const effect = actions$();
  options = {
    dispatch: false,
    ...options,
  };
  setMetadata(effect, null, options);

  return effect;
}
