import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Action } from './types';
import { logAction } from '@datorama/akita';

@Injectable({
  providedIn: 'root',
})
export class Actions extends Subject<Action> {
  dispatch(value: Action): void {
    this.logAction(value);
    this.next(value);
  }

  logAction(value: Action): void {
    const { type, ...props } = value;
    const hasPayload = Object.getOwnPropertyNames(props).length > 0;
    logAction(type, null, hasPayload ? props : null);
  }
}
