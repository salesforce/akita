import { ID } from './types';

export enum EntityActions {
  Set,
  Add,
  Update,
  Remove
}

export interface EntityAction {
  type: EntityActions;
  ids: ID[]
}
