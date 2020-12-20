import { AnonymousSubject } from 'rxjs/internal/Subject';

export interface EffectOptions {
  dispatch?: boolean;
}

export interface Effect extends AnonymousSubject<Action> {
  isEffect: boolean;
  name: string | null;
  dispatchAction: boolean
}

export interface Action {
  type: string;
  [key: string]: any
}
