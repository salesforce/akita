import { isNumber } from '../internal/utils';

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
