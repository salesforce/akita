import { Observable, of, OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * @example
 *
 * query.selectEntity(2).pipe(filterNil)
 * @deprecated Use the operator function filterNilValue()
 */
export const filterNil = <T>(source: Observable<T | undefined | null>): Observable<NonNullable<T>> =>
  source.pipe(filter((value): value is NonNullable<T> => value !== null && typeof value !== 'undefined'));

/**
 * @example
 *
 * query.selectEntity(2).pipe(filterNilValue())
 */
export function filterNilValue<T>(): OperatorFunction<T, NonNullable<T>> {
  return filter((value: T): value is NonNullable<T> => value !== null && value !== undefined);
}
