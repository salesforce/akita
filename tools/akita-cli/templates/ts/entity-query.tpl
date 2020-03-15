import { QueryEntity } from '@datorama/akita';
import { {{pascalCase name}}Store, {{ pascalCase name }}State, {{ camelCase name }}Store } from './{{dashCase name}}.store';

export class {{pascalCase name}}Query extends QueryEntity<{{ pascalCase name }}State> {

  constructor(protected store: {{pascalCase name}}Store) {
    super(store);
  }

}

export const {{ camelCase name }}Query = new {{pascalCase name}}Query({{ camelCase name }}Store);
