export enum EntityActions {
  Set = 'Set',
  Add = 'Add',
  Update = 'Update',
  Remove = 'Remove',
}

export type EntityActionsNames = keyof typeof EntityActions;

export interface EntityAction<IDType> {
  type: EntityActions;
  ids: IDType[];
}
