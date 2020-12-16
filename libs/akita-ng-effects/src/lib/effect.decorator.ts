export function Effect() {
  return function (classProto: any, propKey: string): any {
    const valuesByInstance = new WeakMap();

    Object.defineProperty(classProto, propKey, {
      get: function () {
        return valuesByInstance.get(this);
      },
      set: function (value) {
        valuesByInstance.set(this, value.subscribe());
      },
    });
  };
}



