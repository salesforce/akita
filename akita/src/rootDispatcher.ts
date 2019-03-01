import { ReplaySubject } from 'rxjs';
import { Action } from './actions';

// @internal
export const rootDispatcher = new ReplaySubject<Action>();
