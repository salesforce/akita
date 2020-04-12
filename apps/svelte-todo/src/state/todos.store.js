import {
  createEntityStore,
} from '@datorama/akita';

const initialState = {
  filter: "SHOW_ALL"
};

export const todosStore = createEntityStore(initialState, {
  name: 'todos'
});