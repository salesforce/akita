import { Injectable } from '@angular/core';
import { MonoTypeOperatorFunction, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActionType, EntityServiceAction, HttpMethod } from './types';

export const ofType = (type: ActionType): MonoTypeOperatorFunction<EntityServiceAction> => filter((action: EntityServiceAction) => action.type === type);

export const filterMethod = (method: HttpMethod | keyof typeof HttpMethod): MonoTypeOperatorFunction<EntityServiceAction> => filter((action: EntityServiceAction) => action.method === method);

export const filterStore = (name: string): MonoTypeOperatorFunction<EntityServiceAction> => filter((action: EntityServiceAction) => action.storeName === name);

@Injectable({ providedIn: 'root' })
export class NgEntityServiceNotifier {
  private readonly dispatcher = new Subject<EntityServiceAction>();

  action$ = this.dispatcher.asObservable();

  dispatch(event: EntityServiceAction): void {
    this.dispatcher.next(event);
  }
}
