import { toBoolean } from './toBoolean';

/** @internal */
export function isPlainObject(value): value is object {
  return toBoolean(value) && value.constructor.name === 'Object';
}
