import { isNil } from './isNil';

// @internal
export function isDefined(val: any) {
  return isNil(val) === false;
}
