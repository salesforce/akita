import { Actions } from '@datorama/akita-ng-effects';
import { fakeAsync, flush } from '@angular/core/testing';

describe('Actions', () => {
  it('should notify on dispatched event', fakeAsync(() => {
    const actions = new Actions();
    actions.subscribe(val => {
      expect(val).toBe('test');
    });
    actions.dispatch('test');
    flush();
  }));
});
