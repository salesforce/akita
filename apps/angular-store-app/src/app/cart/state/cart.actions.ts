import { createAction, payload, props } from '@datorama/akita-ng-effects';
import { ID } from '@datorama/akita';

export namespace CartActions {
  export const removeItem = createAction('[Cart] Remove Item', props<{ productId: ID }>());
  export const removeItemSuccess = createAction('[Cart] Remove Item Success');
}
// alternative
// export const removeItem = createAction("[Cart] Remove Item", payload<{productId: ID}>())
