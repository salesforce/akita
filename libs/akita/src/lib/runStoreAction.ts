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
  UpsertManyEntities,
}

export interface StoreActionConfig<TActionType extends StoreActionType, TPayload> {
  type: TActionType;
  payload: TPayload;
}

export class StoreActions {
  private constructor() {}

  static buildActionConfig<TActionType extends StoreActionType, TPayload>(type: TActionType, payload: TPayload): StoreActionConfig<TActionType, TPayload> {
    return {
      type,
      payload,
    };
  }

  static SetEntities<Entity>(payload: StoreActions.SetEntitiesPayload<Entity>) {
    return this.buildActionConfig(StoreActionType.SetEntities, payload);
  }

  static AddEntities<Entity>(payload: StoreActions.AddEntitiesPayload<Entity>) {
    return this.buildActionConfig(StoreActionType.AddEntities, payload);
  }

  static UpdateEntities<Entity>(payload: StoreActions.UpdateEntitiesPayload<Entity>) {
    return this.buildActionConfig(StoreActionType.UpdateEntities, payload);
  }

  static RemoveEntities<Entity>(payload: StoreActions.RemoveEntitiesPayload<Entity>) {
    return this.buildActionConfig(StoreActionType.RemoveEntities, payload);
  }

  static UpsertEntities<Payload extends StoreActions.UpsertEntitiesPayload<Entity, NewEntity>, Entity, NewEntity extends Partial<Entity>>(payload: Payload);
  /**
   * @deprecated
   */
  static UpsertEntities<Payload extends StoreActions.UpsertEntitiesPayloadUnsafe<Entity, NewEntity>, Entity, NewEntity extends Partial<Entity> & { newState?: never; onCreate?: never }>(
    payload: Payload
  );
  static UpsertEntities<Payload extends StoreActions.UpsertEntitiesPayloadUnsafe<Entity, NewEntity> | StoreActions.UpsertEntitiesPayload<Entity, NewEntity>, Entity, NewEntity extends Partial<Entity>>(
    payload: Payload
  ) {
    return this.buildActionConfig(StoreActionType.UpsertEntities, payload);
  }

  static UpsertManyEntities<Entity>(payload: StoreActions.UpsertManyEntitiesPayload<Entity>) {
    return this.buildActionConfig(StoreActionType.UpsertManyEntities, payload);
  }

  static Update<Entity>(payload: StoreActions.UpdatePayload<Entity>) {
    return this.buildActionConfig(StoreActionType.Update, payload);
  }
}

export declare namespace StoreActions {
  export interface SetEntitiesPayload<Entity> {
    data: SetEntitiesData<Entity>;
  }

  export interface AddEntitiesPayload<Entity> {
    data: Entity[] | Entity;
    params?: AddEntitiesOptions;
  }

  export interface UpdateEntitiesPayload<Entity> {
    data: Partial<Entity> | Partial<Entity>[];
    entityIds: IDS;
  }

  export interface RemoveEntitiesPayload<Entity> {
    entityIds: IDS;
  }

  export interface UpsertEntitiesPayload<Entity, NewEntity extends Partial<Entity>> {
    data: {
      newState: NewEntity;
      onCreate: CreateStateCallback<Entity, NewEntity, ID>;
    };
    entityIds: IDS;
  }

  export interface UpsertEntitiesPayloadUnsafe<Entity, NewEntity extends Partial<Entity> & { newState?: never; onCreate?: never }> {
    data: NewEntity;
    entityIds: IDS;
  }

  export interface UpsertManyEntitiesPayload<Entity> {
    data: Entity[];
  }

  // /**
  //  * @deprecated
  //  */
  // export interface UpsertEntitiesPayloadDeprecated<Entity, NewEntity extends Partial<Entity>> /*extends Discriminant<'UpsertEntitiesPayloadDeprecated'>*/ {
  //   data: NewEntity;
  //   entityIds: IDS;
  // }
  //
  // export interface UpsertManyEntitiesPayload<Entity, NewEntity extends Partial<Entity>> /*extends Discriminant<'UpsertManyEntitiesPayload'>*/ {
  //   data: Entity | Entity[];
  // }

  export interface UpdatePayload<Entity> {
    data: Partial<Entity>;
  }

  export type AnyStoreActionConfig<Entity, NewEntity extends Partial<Entity> = Partial<Entity>> =
    | StoreActionConfig<StoreActionType.SetEntities, SetEntitiesPayload<Entity>>
    | StoreActionConfig<StoreActionType.AddEntities, AddEntitiesPayload<Entity>>
    | StoreActionConfig<StoreActionType.UpdateEntities, UpdateEntitiesPayload<Entity>>
    | StoreActionConfig<StoreActionType.RemoveEntities, RemoveEntitiesPayload<Entity>>
    | StoreActionConfig<StoreActionType.UpsertEntities, UpsertEntitiesPayload<Entity, NewEntity>>
    | StoreActionConfig<StoreActionType.UpsertEntities, UpsertEntitiesPayloadUnsafe<Entity, NewEntity>>
    | StoreActionConfig<StoreActionType.UpsertManyEntities, UpsertManyEntitiesPayload<Entity>>
    | StoreActionConfig<StoreActionType.Update, UpdatePayload<Entity>>;
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
 *      onCreate: (id, newState) => ({ id, ...newState, price: 0 })
 *    },
 *    entityIds: [1, 2]
 * }));
 *
 * runStoreAction('books', StoreActions.UpsertManyEntities({
 *    data: [{ id: 2, title: 'New Title' }, { id: 3, title: 'Another title'}],
 * }));
 *
 * @param storeName
 * @param action
 */
export function runStoreAction<EntityOrState>(storeName: string, action: StoreActions.AnyStoreActionConfig<EntityOrState>): void {
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
      if ('newState' in payload.data || 'onCreate' in payload.data) {
        (store as EntityStore).upsert(payload.entityIds, payload.data.newState, payload.data.onCreate);
      } else {
        (store as EntityStore).upsert(payload.entityIds, payload.data);
      }
      return;
    }

    case StoreActionType.UpsertManyEntities: {
      const { payload } = action;
      (store as EntityStore).upsertMany(payload.data);
      return;
    }

    case StoreActionType.Update: {
      const { payload } = action;
      (store as EntityStore).update(payload.data);
      return;
    }
  }
}
