import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * @example
 *
 * query.selectEntity(2).pipe(filterNil)
 */
export const filterNil = <T>(source: Observable<T | undefined | null>) => source.pipe(filter((value): value is T => value !== null && typeof value !== 'undefined'));
