import { toBoolean } from './toBoolean';

export function isPlainObject(value) {
  return toBoolean(value) && value.constructor.name === 'Object';
}
