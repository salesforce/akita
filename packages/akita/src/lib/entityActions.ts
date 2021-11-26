export enum EntityActions {
  Set = 'Set',
  Add = 'Add',
  Update = 'Update',
  Remove = 'Remove',
}

export interface EntityAction<IDType> {
  type: EntityActions;
  ids: IDType[];
}
