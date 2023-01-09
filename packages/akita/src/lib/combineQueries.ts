import { auditTime, combineLatest, Observable } from 'rxjs';

type ReturnTypes<T extends Observable<any>[]> = { [P in keyof T]: T[P] extends Observable<infer R> ? R : never };
type Observables = [Observable<any>] | Observable<any>[];

export function combineQueries<R extends Observables>(observables: R): Observable<ReturnTypes<R>> {
  return combineLatest(observables).pipe(auditTime(0)) as any;
}
