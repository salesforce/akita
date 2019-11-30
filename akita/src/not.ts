// @internal
export function not(pred: Function): Function {
  return function(...args) {
    return !pred(...args);
  };
}
