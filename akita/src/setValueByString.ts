import { isObject } from './isObject';

/**
 * @internal
 *
 * @example
 * setValue(state, 'todos.ui', { filter: {} })
 */
export function setValue(obj: any, prop: string, val: any) {
  const split = prop.split('.');

  if (split.length === 1) {
    return { ...obj, ...val };
  }

  obj = { ...obj };

  const lastIndex = split.length - 2;
  const removeStoreName = prop.split('.').slice(1);

  removeStoreName.reduce((acc, part, index) => {
    if (index === lastIndex) {
      if (isObject(acc[part])) {
        acc[part] = { ...acc[part], ...val };
      } else {
        acc[part] = val;
      }
    } else {
      acc[part] = { ...acc[part] };
    }

    return acc && acc[part];
  }, obj);

  return obj;
}
