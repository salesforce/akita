import { ID } from '@datorama/akita';

export type Widget = {
  id: ID;
  name: string;
};

let _id = 0;

/**
 * A factory function that creates Widgets
 * @param params
 */
export function createWidget(params?: Partial<Widget>) {
  return {
    id: ++_id,
    name: `Widget ${_id}`
  } as Widget;
}

export function resetId(count?: number) {
  _id = count || 0;
}
