import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Msg } from './types';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export type ActionType = 'success' | 'error';

export type EntityServiceAction = {
  storeName: string;
  type: ActionType;
  payload: any;
  method: HttpMethod;
} & Msg;

export const ofType = (type: ActionType) => filter((action: EntityServiceAction) => action.type === type);

export const filterMethod = (method: HttpMethod | keyof (typeof HttpMethod)) =>
  filter((action: EntityServiceAction) => action.method === method);

export const filterStore = (name: string) => filter((action: EntityServiceAction) => action.storeName === name);

@Injectable({ providedIn: 'root' })
export class NgEntityServiceNotifier {
  private dispatcher = new Subject<EntityServiceAction>();
  action$ = this.dispatcher.asObservable();

  dispatch(event: EntityServiceAction) {
    this.dispatcher.next(event);
  }
}
