/**
 * Generate random guid
 *
 * @example
 *
 * {
 *   id: guid()
 * }
 *
 */
export function guid() {
  return 'xxxxxx4xyx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
