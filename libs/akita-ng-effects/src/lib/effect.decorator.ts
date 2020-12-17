import { setMetadata } from './effect.utils';

export function Effect() {
  return function (classProto: any, propKey: string): any {
    let returnValue;

    Object.defineProperty(classProto, propKey, {
      get: function () {
        return returnValue;
      },
      set: function (value) {
        const setValue = value;
        setMetadata(setValue, propKey);
        returnValue = setValue;
      },
      enumerable: true,
      configurable: true,
    });
  };
}
