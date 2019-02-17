import { isArray } from '@datorama/akita';

export function isEmpty<T>(arr: T) {
  if (isArray(arr)) {
    return arr.length === 0;
  }
  return false;
}
