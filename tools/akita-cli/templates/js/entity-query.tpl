import { createEntityQuery } from '@datorama/akita';
import { {{ camelCase name }}Store } from './{{dashCase name}}.store';

export const {{ camelCase name }}Query = createEntityQuery({{ camelCase name }}Store);
