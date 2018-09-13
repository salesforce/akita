import { __globalState } from './global-state';
import { Observable, Subject, of } from 'rxjs';

/**
 * Start a new transaction batch
 */
export function startBatch() {
  if (!isTransactionInProcess()) {
    __globalState.batchTransaction = new Subject();
  }
  __globalState.activeTransactions++;
}

/**
 * End the transaction
 */
export function endBatch() {
  if (--__globalState.activeTransactions === 0) {
    __globalState.batchTransaction.next(true);
    __globalState.batchTransaction.complete();
  }
}

/**
 * Whether we're inside batch
 */
export function isTransactionInProcess() {
  return __globalState.activeTransactions > 0;
}

/**
 */
export function commit(): Observable<boolean> {
  return __globalState.batchTransaction ? __globalState.batchTransaction.asObservable() : of(true);
}
