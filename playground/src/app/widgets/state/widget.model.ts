import { ID } from '../../../../../../akita/akita/src/index';

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
