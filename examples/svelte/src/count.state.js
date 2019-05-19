import { createStore, createQuery } from '../../../akita/src';

export const store = createStore({ count: 0 }, { name: 'counter' });
export const query = createQuery(store);
export const selectCount = query.select('count');
