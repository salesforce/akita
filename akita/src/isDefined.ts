import { isNil } from './isNil';

export function isDefined(val: any) {
  return isNil(val) === false;
}
