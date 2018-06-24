export type StoreConfigOptions = {
  name: string;
  idKey?: string;
};

export const configKey = 'akitaConfig';

export function StoreConfig(metadata: StoreConfigOptions) {
  return function(constructor: Function) {
    constructor[configKey] = { idKey: 'id' };

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
