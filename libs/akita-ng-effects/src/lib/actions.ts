import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Action } from './types';

@Injectable({
  providedIn: 'root'
})
export class Actions extends Subject<Action> {

  dispatch(value: Action) {
    this.next(value);
  }
}
