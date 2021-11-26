import { Injectable } from '@angular/core';
import { filterNilValue, Query } from '@datorama/akita';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';
import { RouterState, RouterStore } from './router.store';

function slice(section: string) {
  return (source: Observable<RouterState>) => {
    return source.pipe(map((data) => data.state)).pipe(
      filterNilValue(),
      map((state) => state[section])
    );
  };
}

@Injectable({
  providedIn: 'root',
})
export class RouterQuery extends Query<RouterState> {
  __navigationCancel = new Subject();
  __navigationError = new Subject();

  constructor(protected store: RouterStore) {
    super(store);
  }

  selectParams<T = any>(names: string[]): Observable<T[]>;
  selectParams<T = any>(names?: string): Observable<T>;
  selectParams<T = any>(names?: string | string[]): Observable<T | T[]> {
    if (names === undefined) {
      return this.select().pipe(slice('params'), distinctUntilChanged());
    }

    const select = (p: string) => this.select().pipe(slice('params'), pluck(p), distinctUntilChanged());

    if (Array.isArray(names)) {
      const sources = names.map(select);
      return combineLatest(sources);
    }

    return select(names).pipe(distinctUntilChanged());
  }

  getParams<T = any>(name?: string): T | null {
    if (this.getValue().state) {
      const params = this.getValue().state.params;
      if (name === undefined) {
        return params as T;
      }

      return params[name];
    }

    return null;
  }

  selectQueryParams<T = any>(names: string[]): Observable<T[]>;
  selectQueryParams<T = any>(names?: string): Observable<T>;
  selectQueryParams<T = any>(names?: string | string[]): Observable<T | T[]> {
    if (names === undefined) {
      return this.select().pipe(slice('queryParams'), distinctUntilChanged());
    }

    const select = (p: string) => this.select().pipe(slice('queryParams'), pluck(p), distinctUntilChanged());

    if (Array.isArray(names)) {
      const sources = names.map(select);
      return combineLatest(sources);
    }

    return select(names);
  }

  getQueryParams<T = any>(name?: string): T | null {
    if (this.getValue().state) {
      const params = this.getValue().state.queryParams;
      if (name === undefined) {
        return params as T;
      }

      return params[name];
    }

    return null;
  }

  selectFragment(): Observable<string> {
    return this.select().pipe(slice('fragment'), distinctUntilChanged());
  }

  getFragment(): string | null {
    if (this.getValue().state) {
      return this.getValue().state.fragment;
    }

    return null;
  }

  selectData<T = any>(name?: string): Observable<T> {
    if (name === undefined) {
      return this.select().pipe(slice('data'), distinctUntilChanged());
    }

    return this.select().pipe(slice('data'), pluck(name), distinctUntilChanged());
  }

  getData<T = any>(name?: string): T | null {
    if (this.getValue().state) {
      const data = this.getValue().state.data;
      if (name === undefined) {
        return data as T;
      }

      return data[name];
    }

    return null;
  }

  selectNavigationExtras<T = any>(name?: string): Observable<T> {
    if (name === undefined) {
      return this.select().pipe(slice('navigationExtras'), distinctUntilChanged());
    }

    return this.select().pipe(slice('data'), pluck(name), distinctUntilChanged());
  }

  getNavigationExtras<T = any>(name?: string): T | null {
    if (this.getValue().state) {
      const data = this.getValue().state.navigationExtras;
      if (name === undefined) {
        return data as T;
      }

      return data[name];
    }

    return null;
  }

  selectNavigationCancel() {
    return this.__navigationCancel.asObservable();
  }

  selectNavigationError() {
    return this.__navigationError.asObservable();
  }
}
