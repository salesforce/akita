import { Observable, Subscription } from 'rxjs';

export function createEffect<T>(actions$: () => Observable<T>): Subscription {
  return actions$().subscribe()
}
