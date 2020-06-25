/**
 * Create an array value comparator for a specific key of the value.
 * @param prop The property of the value to be compared.
 */
export function byKey<T>(prop: keyof T) {
  return (a: T, b: T) => a[prop] === b[prop];
}

/**
 * Create an array value comparator for the id field of an array value.
 */
export function byId<T extends Record<'id', any>>() {
  return byKey<T>('id');
}

/**
 * Adds or removes a value from an array by comparing its values. If a matching value exists it is removed, otherwise
 * it is added to the array.
 *
 * @param array The array to modify.
 * @param newValue The new value to toggle.
 * @param compare A compare function to determine equality of array values. Default is an equality test by object identity.
 */
export function arrayToggle<T>(array: T[], newValue: T, compare: (a: T, b: T) => boolean = (a, b) => a === b) {
  const index = array.findIndex((oldValue) => compare(newValue, oldValue));
  return !!~index ? [...array.slice(0, index), ...array.slice(index + 1)] : [...array, newValue];
}
