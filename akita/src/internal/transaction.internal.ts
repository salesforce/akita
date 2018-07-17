import { globalState } from './global-state';
import { Observable, Subject, of } from 'rxjs';

/**
 * Start a new transaction batch
 */
export function startBatch() {
  if (!isTransactionInProcess()) {
    globalState.batchTransaction = new Subject();
  }

  globalState.activeTransactions++;
}

/**
 * End the transaction
 */
export function endBatch() {
  if (--globalState.activeTransactions === 0) {
    globalState.batchTransaction.next(true);
    globalState.batchTransaction.complete();
  }
}

/**
 * Whether we're inside batch
 */
export function isTransactionInProcess() {
  return globalState.activeTransactions > 0;
}

/**
 */
export function commit(): Observable<boolean> {
  return globalState.batchTransaction ? globalState.batchTransaction.asObservable() : of(true);
}
