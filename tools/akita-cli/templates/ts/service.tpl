import { ID } from '@datorama/akita';
import { {{pascalCase name}}Store, {{ camelCase name }}Store } from './{{dashCase name}}.store';

export class {{pascalCase name}}Service {

  constructor(private {{camelCase name}}Store: {{pascalCase name}}Store) {
  }

}

export const {{ camelCase name }}Service = new {{ pascalCase name }}Service({{ camelCase name }}Store);
