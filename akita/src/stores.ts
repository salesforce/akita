import { Store } from './store';
import { isDev } from './env';
import { isBrowser } from './root';

// @internal
export const __stores__: { [storeName: string]: Store<any> } = {};

if (isBrowser && isDev()) {
  (window as any).$$stores = __stores__;
}
