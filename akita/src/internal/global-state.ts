import { Subject } from 'rxjs';
import { ID } from '../api/types';

export type Action = {
  type: string;
  entityId?: ID[] | ID;
  payload?: any;
};

export class AkitaGlobals {
  private customAction;
  currentAction: Action;
  skipAction = false;
  skipTransactionMsg = false;
  currentT = [];
  activeTransactions = 0;
  batchTransaction: Subject<boolean>;

  setAction(_action: Action) {
    if (this.customAction) {
      this.currentAction = this.customAction;
      this.customAction = null;
      this.skipTransactionMsg = false;
    } else {
      if (this.activeTransactions === 0) {
        this.currentAction = _action;
      }
    }

    if (this.activeTransactions > 0) {
      this.currentT.push(_action);
    }
  }

  setCustomAction(action: Action, skipTransactionMsg = false) {
    this.currentAction = this.customAction = action;
    this.skipTransactionMsg = skipTransactionMsg;
  }

  setSkipAction(skip = true) {
    this.skipAction = skip;
  }
}

export const __globalState = new AkitaGlobals();
