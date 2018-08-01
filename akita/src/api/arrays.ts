import { isObject } from '../internal/utils';

// https://github.com/georapbox/immutable-arrays

/**
 * Adds one or more elements to the end of an array by returning
 * a new array instead of mutating the original one.
 *
 * @example
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = push(originalArray, 'f', 'g');
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['a', 'b', 'c', 'd', 'e', 'f', 'g']
 */
export function push<T>(array: T[], ...elementN: T[]): T[] {
  return [...array, ...elementN];
}

/**
 * Deletes an element from an array by its index in the array.
 *
 * @example
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = remove(originalArray, 2);
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['a', 'b', 'd', 'e']
 */
export function remove<T>(array: T[], index: number): T[] {
  return index >= 0 ? [...array.slice(0, index), ...array.slice(index + 1)] : [...array];
}

/**
 * Removes the last element from an array by returning
 * a new array instead of mutating the original one.
 *
 * @example
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = pop(originalArray);
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['a', 'b', 'c', 'd']
 */
export function pop<T>(array: T[]): T[] {
  return array.slice(0, -1);
}

/**
 * Adds one or more elements to the beginning of an array.
 *
 * @example
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = unshift(originalArray, 'f', 'g');
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['f', 'g', 'a', 'b', 'c', 'd', 'e']
 */
export function unshift<T>(array: T[], ...elementN: T[]): T[] {
  return [...elementN, ...array];
}

/**
 * Sorts the elements of an array (not in place) and returns a sorted array.
 *
 * @example
 * const numberArray = [20, 3, 4, 10, -3, 1, 0, 5];
 * const stringArray = ['Blue', 'Humpback', 'Beluga'];
 *
 * const resultArray = sort(numberArray, (a, b) => a - b);
 * // -> numberArray [20, 3, 4, 10, -3, 1, 0, 5]
 * // -> resultArray [-3, 0, 1, 3, 4, 5, 10, 20]
 *
 * const resultArray = sort(numberArray, (a, b) => b - a);
 * // -> numberArray [20, 3, 4, 10, -3, 1, 0, 5]
 * // -> resultArray [20, 10, 5, 4, 3, 1, 0, -3]
 *
 * const resultArray = sort(stringArray);
 * // -> stringArray ['Blue', 'Humpback', 'Beluga']
 * // -> resultArray ['Beluga', 'Blue', 'Humpback']
 *
 * const resultArray = sort(stringArray, (a, b) => a.toLowerCase() < b.toLowerCase());
 * // -> stringArray ['Blue', 'Humpback', 'Beluga']
 * // -> resultArray ['Humpback', 'Blue', 'Beluga']
 */
export function sort<T>(array: T[], compareFunction?: (a: T, b: T) => number): T[] {
  return [...array].sort(compareFunction);
}

/**
 * Reverses an array (not in place).
 * The first array element becomes the last, and the last array element becomes the first.
 *
 * @example
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = reverse(originalArray);
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['e', 'd', 'c', 'b', 'a']
 */
export function reverse<T>(array: T[]): T[] {
  return [...array].reverse();
}

/**
 * Swap items in the array
 *
 * @example
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = swap(originalArray, 1, 4);
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['a', 'e', 'c', 'd', 'b']
 */
export function swap<T>(array: T[], firstIndex: number, secondIndex: number): T[] {
  const results = array.slice();
  const firstItem = array[firstIndex];
  results[firstIndex] = array[secondIndex];
  results[secondIndex] = firstItem;

  return results;
}

/**
 * Update item in the array
 *
 * @example
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = update(originalArray, 1, 'newItem');
 * // -> resultArray ['a', 'newItem', 'c', 'd', 'b']
 *
 * const originalArray = [{title: 1}, {title: 2}];
 * const resultArray = update(originalArray, originalArray[0], {title: 3});
 * // -> resultArray  [{title: 3}, {title: 2}];
 */
export function update<T>(array: T[], indexOrItem: number | object, updated: T): T[] {
  return array.map((current, idx) => {
    if (typeof indexOrItem === 'number' && idx === indexOrItem) {
      return updated;
    }

    if (isObject(indexOrItem) && (indexOrItem as any) === current) {
      return {
        ...(indexOrItem as object),
        ...updated
      };
    }

    return current;
  });
}

/**
 * Removes existing elements and/or adds new elements to an array.
 *
 * @example
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = splice(originalArray, 0);
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray []
 *
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = splice(originalArray, 0, 1);
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['b', 'c', 'd', 'e']
 *
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = splice(originalArray, 0, 3);
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['d', 'e']
 *
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = splice(originalArray, 0, originalArray.length);
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray []
 *
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = splice(originalArray, 0, -3);
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['a', 'b', 'c', 'd', 'e']
 *
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = splice(originalArray, 0, 0, 'lorem', 'ipsum');
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['lorem', 'ipsum', 'a', 'b', 'c', 'd', 'e']
 *
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = splice(originalArray, originalArray.length, 0, 'lorem', 'ipsum');
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['a', 'b', 'c', 'd', 'e', 'lorem', 'ipsum']
 *
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = splice(originalArray, 0, 2, 'lorem', 'ipsum');
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['lorem', 'ipsum', 'c', 'd', 'e']
 *
 * const originalArray = ['a', 'b', 'c', 'd', 'e'];
 * const resultArray = splice(originalArray, originalArray.length - 2, 2, 'lorem', 'ipsum');
 * // -> originalArray ['a', 'b', 'c', 'd', 'e']
 * // -> resultArray ['a', 'b', 'c', 'lorem', 'ipsum']
 */
export function splice<T>(array: T[], start = array.length, deleteCount = array.length - start, ...elementN: T[]): T[] {
  return [...array.slice(0, start), ...elementN, ...array.slice(start + (deleteCount < 0 ? 0 : deleteCount))];
}

export function toggle<T>(arr: T[], item: T) {
  return arr.indexOf(item) > -1 ? arr.filter(current => item !== current) : push(arr, item);
}
