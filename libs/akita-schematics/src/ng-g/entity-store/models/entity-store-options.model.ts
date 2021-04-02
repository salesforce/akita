import { ActiveStateType } from './active-state.enum';

export interface EntityStoreOptions {
  name: string;
  path: string;
  spec: boolean;
  dirName: string;
  withActive: ActiveStateType;
  idType: string;
}
