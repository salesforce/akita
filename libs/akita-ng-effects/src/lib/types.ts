import { Subject } from 'rxjs';

export interface EffectOptions {
  /**
   * This parameter dictates if the effect can dispatch an action.
   * Set `true` if you want the effect to dispatch an action.
   * Set to `false` or omit if the effect should not dispatch any action.
   */
  dispatch?: boolean;
}

export interface Effect extends Subject<Action> {
  isEffect: boolean;
  name: string | null;
  dispatchAction: boolean;
}

export interface Action {
  type: string;
  [key: string]: any;
}
