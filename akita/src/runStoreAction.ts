import { __stores__ } from './stores';
import { IDS } from './types';
import { AddEntitiesOptions } from './addEntities';
import { EntityStore } from './entityStore';
import { SetEntities } from './setEntities';
import { isNil } from './isNil';
import { AkitaError } from './errors';

export enum StoreActions {
  Update,
  AddEntities,
  SetEntities,
  UpdateEntities,
  RemoveEntities,
  UpsertEntities
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

interface RunStoreActionUpsertEntities<Entity = any> {
  payload: {
    data: Partial<Entity>[] | Partial<Entity>;
    entityIds?: IDS;
  };
}

interface RunStoreActionUpdate<State = any> {
  payload: {
    data: Partial<State>;
  };
}

/**
 * @example
 *
 * runStoreAction('books', StoreActions.Update, {
 *   payload: {
 *    data: { filter: 'New filter' }
 *   }
 * });
 */
export function runStoreAction<State = any>(storeName: string, action: StoreActions.Update, params: RunStoreActionUpdate<State>);
/**
 * @example
 *
 * runStoreAction('books', StoreActions.RemoveEntities, {
 *   payload: {
 *    entityIds: 2
 *   }
 * });
 */
export function runStoreAction<Entity = any>(storeName: string, action: StoreActions.RemoveEntities, params: RunStoreActionRemoveEntities<Entity>);
/**
 * @example
 *
 * runStoreAction('books', StoreActions.UpdateEntities, {
 *   payload: {
 *    data: { title: 'New title' },
 *    entityIds: 2
 *   }
 * });
 */
export function runStoreAction<Entity = any>(storeName: string, action: StoreActions.UpdateEntities, params: RunStoreActionUpdateEntities<Entity>);
/**
 * @example
 *
 * runStoreAction('books', StoreActions.SetEntities, {
 *   payload: {
 *    data: [{ id: 1 }, { id: 2 }]
 *   }
 * });
 */
export function runStoreAction<Entity = any>(storeName: string, action: StoreActions.SetEntities, params: RunStoreActionSetEntities<Entity>);
/**
 * @example
 *
 * runStoreAction('books', StoreActions.AddEntities, {
 *   payload: {
 *    data: { id: 1 }
 *   }
 * });
 */
export function runStoreAction<Entity = any>(storeName: string, action: StoreActions.AddEntities, params: RunStoreActionAddEntities<Entity>);
/**
 * @example
 *
 * runStoreAction('books', StoreActions.UpsertEntities, {
 *   payload: {
 *    data: { title: 'New Title' },
 *    entityIds: [1, 2]
 *   }
 * });
 * runStoreAction('books', StoreActions.UpsertEntities, {
 *   payload: {
 *    data: [{ id: 2, title: 'New Title' }, { id: 3, title: 'Another title'}],
 *   }
 * });
 */
export function runStoreAction<Entity = any>(storeName: string, action: StoreActions.UpsertEntities, params: RunStoreActionUpsertEntities<Entity>);
export function runStoreAction<EntityOrState = any>(
  storeName: string,
  action: StoreActions,
  params:
    | RunStoreActionSetEntities<EntityOrState>
    | RunStoreActionAddEntities<EntityOrState>
    | RunStoreActionRemoveEntities<EntityOrState>
    | RunStoreActionUpdateEntities<EntityOrState>
    | RunStoreActionUpsertEntities<EntityOrState>
) {
  const store = __stores__[storeName];

  if (isNil(store)) {
    throw new AkitaError(`${storeName} doesn't exist`);
  }

  switch (action) {
    case StoreActions.SetEntities: {
      const { payload } = params as RunStoreActionSetEntities;
      (store as EntityStore).set(payload.data);
      return;
    }
    case StoreActions.AddEntities: {
      const { payload } = params as RunStoreActionAddEntities;
      (store as EntityStore).add(payload.data, payload.params);
      return;
    }

    case StoreActions.UpdateEntities: {
      const { payload } = params as RunStoreActionUpdateEntities;
      (store as EntityStore).update(payload.entityIds, payload.data);
      return;
    }

    case StoreActions.RemoveEntities: {
      const { payload } = params as RunStoreActionRemoveEntities;
      (store as EntityStore).remove(payload.entityIds);
      return;
    }

    case StoreActions.UpsertEntities: {
      const { payload } = params as RunStoreActionUpsertEntities;
      if (payload.entityIds) {
        (store as EntityStore).upsert(payload.entityIds, payload.data);
      } else if (Array.isArray(payload.data)) {
        (store as EntityStore).upsertMany(payload.data);
      } else {
        (store as EntityStore).upsertMany([payload.data]);
      }
      return;
    }

    case StoreActions.Update: {
      const { payload } = params as RunStoreActionUpdate;
      (store as EntityStore).update(payload.data);
      return;
    }
  }
}
