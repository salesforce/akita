export enum EntityActions {
  Set,
  Add,
  Update,
  Remove
}

export interface EntityAction<IDType> {
  type: EntityActions;
  ids: IDType[];
}
