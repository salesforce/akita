import { createEntityStore } from '@datorama/akita';

const initialState = {};

export const {{ camelCase name }}Store = createEntityStore(initialState, {
  name: '{{name}}'{{#if idKey}},
  idKey: '{{idKey}}'{{/if}}
});

