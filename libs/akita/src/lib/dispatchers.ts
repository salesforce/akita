import { ReplaySubject, Subject } from 'rxjs';

/** @internal */
export const $$deleteStore = new Subject<string>();
/** @internal */
export const $$addStore = new ReplaySubject<string>(50, 5000);
/** @internal */
export const $$updateStore = new Subject<string>();

/** @internal */
export function dispatchDeleted(storeName: string): void {
  $$deleteStore.next(storeName);
}

/** @internal */
export function dispatchAdded(storeName: string): void {
  $$addStore.next(storeName);
}

/** @internal */
export function dispatchUpdate(storeName: string): void {
  $$updateStore.next(storeName);
}
