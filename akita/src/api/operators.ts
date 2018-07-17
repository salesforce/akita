/** Checks if value is null or undefined */
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export const filterNil = <T>(source: Observable<T>) => source.pipe(filter(value => value !== null && typeof value !== 'undefined'));
