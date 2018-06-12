import { Subject } from 'rxjs';

export class AkitaGlobals {
  /**
   * How many transactions block
   */
  activeTransactions = 0;

  /**
   * Emit when the last transaction committed
   */
  batchTransaction: Subject<boolean>;
}

const globalState = new AkitaGlobals();

/**
 *
 */
export function getGlobalState() {
  return globalState;
}
