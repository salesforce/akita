import { QueryEntity } from '@datorama/akita';
import { {{pascalCase name}}Store, {{ pascalCase name }}State, {{ camelCase name }}Store } from './{{dashCase name}}.store';
import { {{singular (pascalCase name)}} } from './{{singular (dashCase name)}}.model';

export class {{pascalCase name}}Query extends QueryEntity<{{ pascalCase name }}State, {{singular (pascalCase name)}}> {

  constructor(protected store: {{pascalCase name}}Store) {
    super(store);
  }

}

export const {{ camelCase name }}Query = new {{pascalCase name}}Query({{ camelCase name }}Store);
