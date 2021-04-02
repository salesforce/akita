import { isFunction } from './isFunction';

export function compareKeys<T>(keysOrFuncs: any[]) {
  return function <T>(prevState, currState) {
    const isFns = isFunction(keysOrFuncs[0]);
    // Return when they are NOT changed
    return keysOrFuncs.some(keyOrFunc => {
      if(isFns) {
        return keyOrFunc(prevState) !== keyOrFunc(currState);
      }
      return prevState[keyOrFunc] !== currState[keyOrFunc];
    }) === false;
  };
}
