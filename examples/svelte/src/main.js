import App from './App.svelte';

import { akitaDevtools } from '@datorama/akita';

akitaDevtools();

const app = new App({
  target: document.body,
  intro: true
});

export default app;
