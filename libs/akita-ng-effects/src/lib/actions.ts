import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Action, Typed } from 'ts-action';

@Injectable({
  providedIn: 'root'
})
export class Actions<T = Action> extends Subject<T> {
  // todo might need stricter type
  dispatch(value: Typed<any, string>) {
    this.next(value);
  }
}
