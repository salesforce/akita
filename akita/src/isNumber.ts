import { isArray } from './isArray';

export function isNumber(value: any): value is number {
  return !isArray(value) && value - parseFloat(value) + 1 >= 0;
}
