import App from './App.svelte';

import { akitaDevtools, persistState } from '@datorama/akita';

akitaDevtools();
persistState();

const app = new App({
  target: document.body,
  intro: true
});

export default app;
