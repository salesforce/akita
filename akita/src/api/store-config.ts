export type StoreConfigOptions = {
  name: string;
  idKey?: string;
};

export const configKey = 'akitaConfig';

export function StoreConfig(metadata: StoreConfigOptions) {
  return function(constructor: Function) {
    constructor[configKey] = { idKey: 'id' };

    // TODO: attach the life cycle hooks from the prototype to the store instance and invoke them each in his turn/event.
    if (constructor.prototype.storeOnInit) {
      constructor[configKey]['storeOnInit'] = constructor.prototype.storeOnInit;
    }

    if (constructor.prototype.storeOnUpdate) {
      constructor[configKey]['storeOnUpdate'] = constructor.prototype.storeOnUpdate;
    }

    for (let i = 0, keys = Object.keys(metadata); i < keys.length; i++) {
      const key = keys[i];
      /* name is preserved read only key */
      if (key === 'name') {
        constructor[configKey]['storeName'] = metadata[key];
      } else {
        constructor[configKey][key] = metadata[key];
      }
    }
  };
}
