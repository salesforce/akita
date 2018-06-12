export function memoizeOne(fn: Function) {
  let lastArgs;
  let changed = false;
  let firstInit = true;
  let lastResult;

  return function(...args) {
    if (lastArgs) {
      /** If entities nor ids doesn't change return the last value */
      changed = lastArgs[1] !== args[1] || lastArgs[0] !== args[0];
    }

    if (firstInit || (changed && !firstInit)) {
      lastResult = fn.apply(this, args);
    }

    firstInit = false;
    lastArgs = args;
    return lastResult;
  };
}
