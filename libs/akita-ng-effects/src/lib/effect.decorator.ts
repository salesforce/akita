import { setMetadata } from './effect.utils';
import { EffectOptions } from './types';

export function Effect(options?: EffectOptions) {
  options = {
    dispatch: false,
    ...options,
  };

  return function (classProto: any, propKey: string): any {
    let returnValue;

    Object.defineProperty(classProto, propKey, {
      get: function () {
        return returnValue;
      },
      set: function (value) {
        setMetadata(value, propKey, options);
        returnValue = value;
      },
      enumerable: true,
    });
  };
}
