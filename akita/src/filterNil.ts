import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// Utility type, remove types from T that are assignable to U
type Diff<T, U> = T extends U ? never : T;

/**
 * @example
 *
 * query.selectEntity(2).pipe(filterNil)
 */
export const filterNil = <T>(source: Observable<T | undefined | null>) => source.pipe(filter((value): value is Diff<T, null | undefined> => value !== null && typeof value !== 'undefined'));
