import { isNumber } from '../internal/utils';
import { __stores__ } from './store';

/**
 * @example
 *
 * this.peopleStore.update(id, person => ({
 *   guests: increment(person.guests)
 * }));
 */
export function increment(value: number, params: { maxValue: number | undefined } = { maxValue: undefined }) {
  if (isNumber(value) === false) return;
  if (params.maxValue && value === params.maxValue) return value;
  return value + 1;
}

/**
 * @example
 *
 * this.peopleStore.update(id, person => ({
 *   guests: decrement(person.guests)
 * }));
 */
export function decrement(value, params: { allowNegative: boolean } = { allowNegative: false }) {
  if (isNumber(value) === false) return;
  if (params.allowNegative === false && value === 0) {
    return value;
  }
  return value - 1;
}

/**
 * Generate random guid
 */
export function guid() {
  return 'xxxxxx4xyx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface ResetStoresParams {
  /**
   *  By default the whole state is resetted, use this param to exclude stores that you don't want to reset.
   */
  exclude: string[];
}


export function resetStores(params?: Partial<ResetStoresParams>) {

  const defaults: ResetStoresParams = {
    exclude: []
  };

  const { exclude } = Object.assign({}, defaults, params);
  let stores = Object.keys(__stores__);

  if (exclude.length > 0) {
    stores = stores.filter(key => !params.exclude.includes(key))
  }

  stores.forEach(storeName => {
    __stores__[storeName].setState(() => ({ ...__stores__[storeName].initialState }));
    __stores__[storeName].setPristine();
  });
}
