import { Injectable } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';

@Injectable({
  providedIn: 'root',
})
export class ContactEffects {
  constructor(private actions$: Actions) {}
}
