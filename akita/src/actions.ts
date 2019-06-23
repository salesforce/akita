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
