import { Query } from './query';
import { isBrowser } from './root';
import { Store } from './store';

// @internal
export const __stores__: { [storeName: string]: Store<any> } = {};

// @internal
export const __queries__: { [storeName: string]: Query<any> } = {};

if (isBrowser) {
  (window as any).$$stores = __stores__;
  (window as any).$$queries = __queries__;
}
