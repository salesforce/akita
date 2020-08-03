import { EntityIdOf, EntityOf, EntityStore } from '../../entityStore';
import { StateOf } from '../../store';

export abstract class EntityStoreUtils {
  static updateOne<TStore extends EntityStore>(store: TStore, oldState: StateOf<TStore>, id: EntityIdOf<TStore>, entityUpdate: Partial<EntityOf<TStore>>) {
    // If the id to update does not exist, then return the current state.
    if (!oldState.ids.includes(id)) {
      return oldState;
    }

    return {
      ...oldState,
      entities: {
        ...oldState.entities,
        [id]: {
          // apply old keys
          ...oldState.entities[id],
          // apply new keys
          ...entityUpdate,
          // ensure the correct id
          [store.idKey]: id,
        },
      },
    };
  }

  static updateMany<TStore extends EntityStore>(store: TStore, oldState: StateOf<TStore>, ids: EntityIdOf<TStore>[], entityUpdate: Partial<EntityOf<TStore>>) {
    const newState = ids.reduce<Pick<StateOf<TStore>, 'ids' | 'entities'>>(
      (newState, id) => {
        const entity = oldState.entities[id];

        // If entity does not exist, skip
        if (entity) {
          newState.ids.push(id);
          newState.entities[id] = {
            // apply old keys
            ...entity,
            // apply new keys
            ...entityUpdate,
            // ensure the correct id
            [store.idKey]: id,
          };
        }

        return newState;
      },
      { ids: [], entities: {} }
    );

    // If there are no ids to update, then return the current state.
    if (newState.ids.length === 0) {
      return oldState;
    }

    return {
      ...oldState,
      entities: {
        ...oldState.entities,
        ...newState.entities,
      },
    };
  }

  static insertMany<TStore extends EntityStore>(store: TStore, oldState: StateOf<TStore>, entities: EntityOf<TStore>[]) {
    const newState = entities
      // split up entity into id and entity
      .map((entity) => [entity[store.idKey] as EntityIdOf<TStore>, entity])
      // ignore entities that already exist
      .filter(([id]) => !oldState.ids.includes(id))
      // map to result state
      .reduce(
        (newState, [id, entity]) => {
          newState.ids.push(id);
          newState.entities[id] = entity;
          return newState;
        },
        { ids: [], entities: {} } as Pick<StateOf<TStore>, 'ids' | 'entities'>
      );

    // If there are no ids to insert, then return the current state.
    if (newState.ids.length === 0) {
      return oldState;
    }

    return {
      ...oldState,
      ids: [...oldState.ids, ...newState.ids],
      entities: {
        ...oldState.entities,
        ...newState.entities,
      },
    };
  }

  static removeMany<TStore extends EntityStore>(store: TStore, oldState: StateOf<TStore>, entityIds: EntityIdOf<TStore>[]) {
    // Remove entity ids from ids array
    const ids = oldState.ids.filter((id) => !entityIds.includes(id));

    // If no entity was remove, then return the current state
    if (ids.length === entityIds.length) {
      return oldState;
    }

    // Create shallow copy
    const entities = Object.assign({}, oldState.entities);

    // Remove entities from state
    for (const id of entityIds) {
      delete entities[id];
    }

    return {
      ...oldState,
      ids,
      entities,
    };
  }

  static replaceMany<TStore extends EntityStore>(store: TStore, oldState: StateOf<TStore>, entities: EntityIdOf<TStore>[], options = { allowInsert: false }) {
    const newState = entities.reduce(
      (newState, entity) => {
        const id = entities[store.idKey] as EntityIdOf<TStore>;

        // Check if entity already exists
        if (oldState.ids.includes(id)) {
          newState.ids.replaced.push(id);
          newState.entities[id] = entity;
        } else if (options.allowInsert) {
          // Skip entity if insert is not allowed
          newState.ids.inserted.push(id);
          newState.entities[id] = entity;
        }

        return newState;
      },
      {
        ids: {
          inserted: [] as StateOf<TStore>['ids'],
          replaced: [] as StateOf<TStore>['ids'],
        },
        entities: {} as StateOf<TStore>['entities'],
      }
    );

    // If there are no ids to replace or to insert, then return the current state.
    if (newState.ids.inserted.length === 0 && newState.ids.replaced.length === 0) {
      return oldState;
    }

    return {
      ...oldState,
      ids: [...oldState.ids, ...newState.ids.inserted],
      entities: {
        ...oldState.entities,
        ...newState.entities,
      },
    };
  }

  static replaceAll<TStore extends EntityStore>(store: TStore, oldState: StateOf<TStore>, entities: EntityIdOf<TStore>[]) {
    const newState = entities
      .map((entity) => [entity[store.idKey] as EntityIdOf<TStore>, entity])
      .reduce(
        (newState, [id, entity]) => {
          newState.ids.push(id);
          newState.entities[id] = entity;
          return newState;
        },
        { ids: [], entities: {} } as Pick<StateOf<TStore>, 'ids' | 'entities'>
      );

    return {
      ...oldState,
      ...newState,
    };
  }
}
