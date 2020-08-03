import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StateOf, Store } from '../../store';
import { Constructor } from '../../types';
import { Action } from './action';
import { Commit } from './commit';

export interface Committed<TStore extends Store, TAction extends Action = Action> {
  __STORE__: TStore;
  action: TAction;
  state: StateOf<TStore>;
}

export function ofType<TCommitted extends Committed<any, any>, TAction extends Action>(commit: Constructor<Commit<TCommitted['__STORE__'], TAction>> & { type: TAction['type'] }) {
  return (source: Observable<TCommitted>) => (source.pipe(filter(({ action: { type } }) => commit.type === type)) as unknown) as Observable<Committed<TCommitted['__STORE__'], TAction>>;
}
