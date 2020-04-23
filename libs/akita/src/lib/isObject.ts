/** @internal */
export function isObject(value: any): value is object | Function {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}
