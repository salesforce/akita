/** @internal */
export function not(pred: Function): Function {
  return (...args): boolean => {
    return !pred(...args);
  };
}
