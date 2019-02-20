import { __stores__ } from './stores';
import { IDS } from './types';
import { AddEntitiesOptions } from './addEntities';
import { EntityStore } from './entityStore';
import { SetEntities } from './setEntities';

export enum StoreActions {
  Update,
  AddEntities,
  SetEntities,
  UpdateEntities,
  RemoveEntities
}

interface RunStoreActionSetEntities<Entity = any> {
  payload: {
    data: SetEntities<Entity>;
  };
}

interface RunStoreActionAddEntities<Entity = any> {
  payload: {
    data: Entity[] | Entity;
    params?: AddEntitiesOptions;
  };
}

interface RunStoreActionUpdateEntities<Entity = any> {
  payload: {
    data: Partial<Entity>;
    entityIds: IDS;
  };
}

interface RunStoreActionRemoveEntities<Entity = any> {
  payload: {
    entityIds: IDS;
  };
}

interface RunStoreActionUpdate<State = any> {
  payload: {
    data: Partial<State>;
  };
}

export function runStoreAction<State = any>(storeName: string, action: StoreActions.Update, params: RunStoreActionUpdate<State>);
export function runStoreAction<Entity = any>(storeName: string, action: StoreActions.RemoveEntities, params: RunStoreActionRemoveEntities<Entity>);
export function runStoreAction<Entity = any>(storeName: string, action: StoreActions.UpdateEntities, params: RunStoreActionUpdateEntities<Entity>);
export function runStoreAction<Entity = any>(storeName: string, action: StoreActions.SetEntities, params: RunStoreActionSetEntities<Entity>);
export function runStoreAction<Entity = any>(storeName: string, action: StoreActions.AddEntities, params: RunStoreActionAddEntities<Entity>);
export function runStoreAction<EntityOrState = any>(
  storeName: string,
  action: StoreActions,
  params: RunStoreActionSetEntities<EntityOrState> | RunStoreActionAddEntities<EntityOrState> | RunStoreActionRemoveEntities<EntityOrState> | RunStoreActionUpdateEntities<EntityOrState>
) {
  const store = __stores__[storeName];
  switch (action) {
    case StoreActions.SetEntities: {
      const { payload } = params as RunStoreActionSetEntities;
      (store as EntityStore<any, any>).set(payload.data);
      return;
    }
    case StoreActions.AddEntities: {
      const { payload } = params as RunStoreActionAddEntities;
      (store as EntityStore<any, any>).add(payload.data, payload.params);
      return;
    }

    case StoreActions.UpdateEntities: {
      const { payload } = params as RunStoreActionUpdateEntities;
      (store as EntityStore<any, any>).update(payload.entityIds, payload.data);
      return;
    }

    case StoreActions.RemoveEntities: {
      const { payload } = params as RunStoreActionRemoveEntities;
      (store as EntityStore<any, any>).remove(payload.entityIds);
      return;
    }

    case StoreActions.Update: {
      const { payload } = params as RunStoreActionUpdate;
      (store as EntityStore<any, any>).update(payload.data);
      return;
    }
  }
}
