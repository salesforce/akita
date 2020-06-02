import { __stores__ } from './stores';
import { CreateStateCallback, ID, IDS } from './types';
import { AddEntitiesOptions } from './addEntities';
import { EntityStore } from './entityStore';
import { SetEntities as SetEntitiesData } from './setEntities';
import { isNil } from './isNil';
import { AkitaError } from './errors';

export enum StoreActionType {
  Update,
  AddEntities,
  SetEntities,
  UpdateEntities,
  RemoveEntities,
  UpsertEntities,
}

export namespace StoreActions {
  export interface ActionConfig<TActionType extends StoreActionType, TPayload> {
    type: TActionType;
    payload: TPayload;
  }

  function buildActionConfig<TActionType extends StoreActionType, TPayload>(type: TActionType, payload: TPayload): ActionConfig<TActionType, TPayload> {
    return {
      type,
      payload,
    };
  }

  export interface SetEntitiesPayload<Entity> {
    data: SetEntitiesData<Entity>;
  }

  export const SetEntities = <Entity>(payload: SetEntitiesPayload<Entity>) => buildActionConfig(StoreActionType.SetEntities, payload);

  export interface AddEntitiesPayload<Entity> {
    data: Entity[] | Entity;
    params?: AddEntitiesOptions;
  }

  export const AddEntities = <Entity>(payload: AddEntitiesPayload<Entity>) => buildActionConfig(StoreActionType.AddEntities, payload);

  export interface UpdateEntitiesPayload<Entity> {
    data: Partial<Entity> | Partial<Entity>[];
    entityIds: IDS;
  }

  export const UpdateEntities = <Entity>(payload: UpdateEntitiesPayload<Entity>) => buildActionConfig(StoreActionType.UpdateEntities, payload);

  export interface RemoveEntitiesPayload<Entity> {
    entityIds: IDS;
  }

  export const RemoveEntities = <Entity>(payload: RemoveEntitiesPayload<Entity>) => buildActionConfig(StoreActionType.RemoveEntities, payload);

  export interface UpsertEntitiesPayload<Entity, NewEntity extends Partial<Entity>> {
    data: {
      newState: NewEntity | NewEntity[];
      onCreate: CreateStateCallback<Entity, NewEntity, ID>;
    };
    entityIds?: IDS;
  }

  export const UpsertEntities = <Entity, NewEntity extends Partial<Entity>>(payload: UpsertEntitiesPayload<Entity, NewEntity>) => buildActionConfig(StoreActionType.UpsertEntities, payload);

  export interface UpdatePayload<Entity> {
    data: Partial<Entity>;
  }

  export const Update = <Entity>(payload: UpdatePayload<Entity>) => buildActionConfig(StoreActionType.Update, payload);

  export type Any = typeof SetEntities | typeof AddEntities | typeof UpdateEntities | typeof RemoveEntities | typeof UpsertEntities | typeof Update;
}

/**
 * @example
 *
 * runStoreAction('books', StoreActions.Update({
 *    data: { filter: 'New filter' }
 * }));
 *
 * @example
 *
 * runStoreAction('books', StoreActions.UpdateEntities({
 *    data: { title: 'New title' },
 *    entityIds: 2
 * }));
 *
 * @example
 *
 * runStoreAction('books', StoreActions.SetEntities({
 *    data: [{ id: 1 }, { id: 2 }]
 * }));
 *
 * @example
 *
 * runStoreAction('books', StoreActions.UpsertEntities({
 *    data: {
 *      newState: { title: 'New Title' },
 *      onCreate: (id, update) => ({ ...update, price: 0 })
 *    },
 *    entityIds: [1, 2]
 * }));
 *
 * runStoreAction('books', StoreActions.UpsertEntities({
 *    data: [{ id: 2, title: 'New Title' }, { id: 3, title: 'Another title'}],
 * }));
 *
 * @param storeName
 * @param action
 */
export function runStoreAction<EntityOrState>(storeName: string, action: ReturnType<StoreActions.Any>): void {
  const store = __stores__[storeName];

  if (isNil(store)) {
    throw new AkitaError(`${storeName} doesn't exist`);
  }

  switch (action.type) {
    case StoreActionType.SetEntities: {
      const { payload } = action;
      (store as EntityStore).set(payload.data);
      return;
    }
    case StoreActionType.AddEntities: {
      const { payload } = action;
      (store as EntityStore).add(payload.data, payload.params);
      return;
    }

    case StoreActionType.UpdateEntities: {
      const { payload } = action;
      (store as EntityStore).update(payload.entityIds, payload.data);
      return;
    }

    case StoreActionType.RemoveEntities: {
      const { payload } = action;
      (store as EntityStore).remove(payload.entityIds);
      return;
    }

    case StoreActionType.UpsertEntities: {
      const { payload } = action;
      if (payload.entityIds) {
        (store as EntityStore).upsert(payload.entityIds, payload.data.newState, payload.data.onCreate);
      } else if (Array.isArray(payload.data.newState)) {
        (store as EntityStore).upsertMany(payload.data.newState);
      } else {
        (store as EntityStore).upsertMany([payload.data]);
      }
      return;
    }

    case StoreActionType.Update: {
      const { payload } = action;
      (store as EntityStore).update(payload.data);
      return;
    }
  }
}
