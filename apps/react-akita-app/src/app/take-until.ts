import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const untilDestroyed = (componentInstance, destroyMethodName = 'componentWillUnmount') => <T>(source: Observable<T>) => {
  const originalDestroy = componentInstance[destroyMethodName];

  if (!componentInstance['__takeUntilDestroy']) {
    componentInstance['__takeUntilDestroy'] = new Subject();

    componentInstance[destroyMethodName] = function() {
      componentInstance['__takeUntilDestroy'].next(true);
      componentInstance['__takeUntilDestroy'].complete();
      typeof originalDestroy === 'function' && originalDestroy.apply(this, arguments);
    };
  }

  return source.pipe(takeUntil<T>(componentInstance['__takeUntilDestroy']));
};
