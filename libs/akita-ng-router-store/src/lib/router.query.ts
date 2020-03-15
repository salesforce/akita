import { Injectable } from '@angular/core';
import { RouterState, RouterStore } from './router.store';
import { filterNil, HashMap, Query } from '@datorama/akita';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';
import { Data, RouterStateSnapshot } from '@angular/router';

function slice(section: string) {
  return (source: Observable<RouterState<RouterStateSnapshot>>) => {
    return source.pipe(map(data => data.state)).pipe(
      filterNil,
      map(state => (state!.root as any)[section])
    );
  };
}

@Injectable({
  providedIn: 'root'
})
export class RouterQuery extends Query<RouterState> {
  __navigationCancel = new Subject();
  __navigationError = new Subject();

  constructor(protected store: RouterStore) {
    super(store);
  }

  selectParams<T>(names: string): Observable<T>;
  selectParams<T>(names: string[]): Observable<T[]>;
  selectParams<T>(): Observable<HashMap<T>>;
  selectParams<T>(names?: string | string[]): Observable<T | T[] | HashMap<T>> {
    if (names === undefined) {
      return this.select().pipe(
        slice('params'),
        distinctUntilChanged()
      );
    }

    const select = (p: string) =>
      this.select().pipe(
        slice('params'),
        pluck(p),
        distinctUntilChanged()
      );

    if (Array.isArray(names)) {
      const sources = names.map(select);
      return combineLatest(sources);
    }

    return select(names).pipe(distinctUntilChanged());
  }

  getParams<T>(): HashMap<T>;
  getParams<T>(name: string): T;
  getParams<T>(name?: string): T | HashMap<any> | null {
    if (this.getValue().state) {
      const params = this.getValue().state!.root.params;
      if (name === undefined) {
        return params;
      }

      return params[name];
    }

    return null;
  }

  selectQueryParams<T>(names: string): Observable<T>;
  selectQueryParams<T>(names: string[]): Observable<T[]>;
  selectQueryParams<T>(): Observable<HashMap<T>>;
  selectQueryParams<T>(names?: string | string[]): Observable<T | T[] | HashMap<T>> {
    if (names === undefined) {
      return this.select().pipe(
        slice('queryParams'),
        distinctUntilChanged()
      );
    }

    const select = (p: string) =>
      this.select().pipe(
        slice('queryParams'),
        pluck(p),
        distinctUntilChanged()
      );

    if (Array.isArray(names)) {
      const sources = names.map(select);
      return combineLatest(sources);
    }

    return select(names);
  }

  getQueryParams<T>(name: string): T;
  getQueryParams<T>(): HashMap<T>;
  getQueryParams<T>(name?: string): T | HashMap<T> | null {
    if (this.getValue().state) {
      const params = this.getValue().state!.root.queryParams;
      if (name === undefined) {
        return params;
      }

      return params[name];
    }

    return null;
  }

  selectFragment(): Observable<string> {
    return this.select().pipe(
      slice('fragment'),
      distinctUntilChanged()
    );
  }

  getFragment(): string | null {
    if (this.getValue().state) {
      return this.getValue().state!.root.fragment;
    }

    return null;
  }

  selectData<T>(name: string): Observable<T>;
  selectData<T>(): Observable<HashMap<T>>;
  selectData<T>(name?: string): Observable<T | HashMap<T>> {
    if (name === undefined) {
      return this.select().pipe(
        slice('data'),
        distinctUntilChanged()
      );
    }

    return this.select().pipe(
      slice('data'),
      pluck(name),
      distinctUntilChanged()
    );
  }

  getData<T>(name: string): T | null;
  getData<T>(): Data | null;
  getData<T>(name?: string): Data | null {
    if (this.getValue().state) {
      const data = this.getValue().state!.root.data;
      if (name === undefined) {
        return data;
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
