import { ReplaySubject } from 'rxjs';
import { Action } from './actions';

export const rootDispatcher = new ReplaySubject<Action>();
