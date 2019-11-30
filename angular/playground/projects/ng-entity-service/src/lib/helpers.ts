import { isNumber, isString } from '@datorama/akita';

export function isID(idOrConfig: any) {
  return isNumber(idOrConfig) || isString(idOrConfig);
}
