import { Store } from './store';
import { isDev } from './env';
import { isBrowser } from './root';
import { Query } from './query';

// @internal
export const __stores__: { [storeName: string]: Store<any> } = {};

// @internal
export const __queries__: { [storeName: string]: Query<any> } = {};

if (isBrowser && isDev()) {
  (window as any).$$stores = __stores__;
  (window as any).$$queries = __queries__;
}
