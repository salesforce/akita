import { toBoolean } from './toBoolean';

// @internal
export function isPlainObject(value) {
  return toBoolean(value) && value.constructor.name === 'Object';
}
