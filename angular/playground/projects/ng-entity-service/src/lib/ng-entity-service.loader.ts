import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { isFunction } from '@datorama/akita';
import { HttpMethod } from './ng-entity-service-notifier';

type Event = { method: HttpMethod; loading: boolean; storeName: string; entityId?: any };

@Injectable({ providedIn: 'root' })
export class NgEntityServiceLoader {
  private dispatcher = new Subject<Event>();
  loading$ = this.dispatcher.asObservable();

  dispatch(event: Event) {
    this.dispatcher.next(event);
  }

  loadersFor(name?: string) {
    const filterStore = filter(({ storeName }: Event) => (name ? storeName === name : true));
    const filterMethod = mthd =>
      filter(({ method }: Event) => {
        return isFunction(mthd) ? mthd(method) : method === mthd;
      });

    const actionBased = (current: ((method) => boolean) | HttpMethod) =>
      this.loading$.pipe(
        filterStore,
        filterMethod(current),
        map(action => action.loading)
      );

    const idBased = (id: any, mthd: ((method) => boolean) | HttpMethod) =>
      this.loading$.pipe(
        filterStore,
        filterMethod(mthd),
        filter(action => action.entityId === id),
        map(action => action.loading)
      );

    return {
      get$: actionBased(HttpMethod.GET),
      add$: actionBased(HttpMethod.POST),
      update$: actionBased(method => method === HttpMethod.PUT || method === HttpMethod.PATCH),
      delete$: actionBased(HttpMethod.DELETE),
      getEntity: (id: any) => idBased(id, HttpMethod.GET),
      updateEntity: (id: any) => idBased(id, method => method === HttpMethod.PUT || method === HttpMethod.PATCH),
      deleteEntity: (id: any) => idBased(id, HttpMethod.DELETE)
    };
  }
}
