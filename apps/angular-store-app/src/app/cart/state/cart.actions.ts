import { createAction, props } from '@datorama/akita-ng-effects';
import { ID } from '@datorama/akita';

export namespace CartActions {
  export const removeItem = createAction('[Cart] Remove Item', props<{ productId: ID }>());
  export const removeItemSuccess = createAction('[Cart] Remove Item Success');

  export const test = createAction('Testing Action');
}
// alternatively
// export const removeItem = createAction("[Cart] Remove Item", payload<{productId: ID}>())
