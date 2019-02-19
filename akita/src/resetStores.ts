import { __stores__ } from './stores';
import { applyTransaction } from './transaction';

export interface ResetStoresParams {
  exclude: string[];
}

export function resetStores(options?: Partial<ResetStoresParams>) {
  const defaults: ResetStoresParams = {
    exclude: []
  };

  options = Object.assign({}, defaults, options);
  const stores = Object.keys(__stores__);

  applyTransaction(() => {
    for (const store of stores) {
      const s = __stores__[store];
      if (!options.exclude) {
        s.reset();
      } else {
        if (options.exclude.indexOf(s.storeName) === -1) {
          s.reset();
        }
      }
    }
  });
}
