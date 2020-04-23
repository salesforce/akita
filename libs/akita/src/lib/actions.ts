export const currentAction = {
  type: null,
  entityIds: null,
  skip: false,
};

let customActionActive = false;

export function resetCustomAction(): void {
  customActionActive = false;
}

export function setAction(type: string, entityIds?): void {
  if (customActionActive === false) {
    currentAction.type = type;
    currentAction.entityIds = entityIds;
  }
}

// public API for custom actions. Custom action always wins
export function logAction(type: string, entityIds?): void {
  setAction(type, entityIds);
  customActionActive = true;
}

export function setSkipAction(skip = true): void {
  currentAction.skip = skip;
}

export function action(actionName: string, entityIds?) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const descriptorCopy = { ...descriptor };

    descriptorCopy.value = function transactionWrapper(...args): any {
      logAction(actionName, entityIds);
      return descriptor.value.apply(this, args);
    };

    return descriptorCopy;
  };
}
