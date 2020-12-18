import { Actions } from '@datorama/akita-ng-effects';
import { fakeAsync, flush } from '@angular/core/testing';
import { Subject } from 'rxjs';

describe('Actions', () => {
  it('should notify on dispatched event', fakeAsync(() => {
    const actions = new Subject();
    actions.subscribe((val) => {
      expect(val).toBe('test');
    });
    actions.next('test');
    flush();
  }));
});
