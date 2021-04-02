import { Store, StoreConfig } from '@datorama/akita';

export interface {{ pascalCase name }}State {
  key: string;
}

export function createInitialState(): {{ pascalCase name }}State {
  return {
    key: ''
  };
}

@StoreConfig({ name: '{{name}}' })
export class {{pascalCase name}}Store extends Store<{{pascalCase name}}State> {

  constructor() {
    super(createInitialState());
  }

}

export const {{ camelCase name }}Store = new {{pascalCase name}}Store();
