import { EntityState } from './index';

// @internal
export const getInitialEntitiesState = () =>
  ({
    entities: {},
    ids: [],
    loading: true,
    error: null
  } as EntityState);
