import { HashMap } from './types';

export const enum Actions {
  NEW_STORE,
  DELETE_STORE,
  NEW_STATE
}

export type Action = {
  type: Actions;
  payload: HashMap<any>;
};

export function newStateAction(storeName, initialState = false) {
  return {
    type: Actions.NEW_STATE,
    payload: {
      name: storeName,
      initialState
    }
  };
}

export const currentAction = {
  type: null,
  entityIds: null,
  skip: false
};

let customActionActive = false;

export function resetCustomAction() {
  customActionActive = false;
}

// public API for custom actions. Custom action always wins
export function logAction(type: string, entityIds?) {
  setAction(type, entityIds);
  customActionActive = true;
}

export function setAction(type: string, entityIds?) {
  if (customActionActive === false) {
    currentAction.type = type;
    currentAction.entityIds = entityIds;
  }
}

export function setSkipAction(skip = true) {
  currentAction.skip = skip;
}

export function action(action: string, entityIds?) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args) {
      logAction(action, entityIds);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
