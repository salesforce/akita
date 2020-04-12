import { isArray } from './isArray';

// @internal
export function isEmpty<T>(arr: T) {
  if (isArray(arr)) {
    return arr.length === 0;
  }
  return false;
}
