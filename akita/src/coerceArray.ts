import { isNil } from './isNil';

export function coerceArray<T>(value: T | T[]): T[] {
  if (isNil(value)) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}
