import { Action, getGlobalState } from './global-state';
const globalState = getGlobalState();

export function applyAction<T>(func: () => T, action: Action, thisArg = undefined): T {
  globalState.setCustomAction(action);
  return func.apply(thisArg);
}

export function action(action: Action) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args) {
      globalState.setCustomAction(action);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
