import { Effect } from '@datorama/akita-ng-effects';
import { of }     from 'rxjs';
import { tap }    from 'rxjs/operators';

describe('@Effect Decorator', () => {

  it('should ', (done) => {
    class TestClass {
      @Effect()
      testEffect$ = of('sample').pipe(
        tap(val => {
          expect(val).toBe('sample');
          done();
        })
      );
    }

    new TestClass();
  });

});
