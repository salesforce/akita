import { Subject } from 'rxjs';
import { ID } from '../api/types';

export type Action = {
  type: string;
  entityId?: ID[];
  payload?: any;
};

const initialAction = { type: '@@INIT' };

export class AkitaGlobals {
  private currentAction: Action = initialAction;
  private customAction;
  private _skipAction = false;
  skipTransactionMsg = false;
  /**
   * How many transactions block
   */
  activeTransactions = 0;

  /**
   * Emit when the last transaction committed
   */
  batchTransaction: Subject<boolean>;

  setAction(_action: Action) {
    if (this.customAction) {
      this.currentAction = this.customAction;
      this.customAction = null;
    } else {
      this.currentAction = _action;
    }
  }

  setInitialAction() {
    this.currentAction = initialAction;
  }

  getAction() {
    return this.currentAction;
  }

  setCustomAction(action: Action, skipTransactionMsg = false) {
    this.currentAction = action;
    this.customAction = action;
    this.skipTransactionMsg = skipTransactionMsg;
  }

  setSkipAction(skip = true) {
    this._skipAction = skip;
  }

  skipAction() {
    return this._skipAction;
  }
}

export const globalState = new AkitaGlobals();
