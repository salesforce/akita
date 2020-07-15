import { coerceArray } from '../coerceArray';
import { EntityStore } from '../entityStore';
import { Store } from '../store';

type StateOf<TStore extends Store> = TStore['__STATE__'];
type EntityOf<TStore extends EntityStore> = TStore['__ENTITY__'];
type EntityIdOf<TStore extends EntityStore> = TStore['__ENTITY_ID_TYPE__'];

const store = <TStore extends Store>() => (undefined as unknown) as TStore;
const action = <TActionType extends string, TActionArgs extends any[]>(type: TActionType, ...args: TActionArgs) => ({ type, args });

export interface Action<TActionType extends string = string, TActionArgs extends any[] = any[]> {
  type: TActionType;
  args: TActionArgs;
}

export interface Commit<TStore extends Store, TAction extends Action = Action, TReduce extends Reduce<TStore, TAction> = Reduce<TStore, TAction>> {
  __STORE__: TStore;

  action: TAction;

  reduce: TReduce;
}

export interface Reduce<TStore extends Store, TAction extends Action> {
  (action: TAction, state: StateOf<TStore>, store: TStore): StateOf<TStore>;
}

function createCommit<TStore extends Store, TAction extends Action, TReduce extends Reduce<TStore, TAction>>(__STORE__: TStore, action: TAction, reduce: TReduce): Commit<TStore, TAction, TReduce> {
  return { action, reduce, __STORE__ };
}

/**
 *
 * @param state
 */
export const update = <TStore extends Store>(state: Partial<StateOf<TStore>>) =>
  createCommit(store<TStore>(), action('update', state), ({ type, args: [newState] }, oldState: StateOf<TStore>, store) => {
    return { ...oldState, ...newState };
  });

/**
 *
 * @param entity
 */
export const insertOne = <TStore extends EntityStore>(entity: EntityOf<TStore>) =>
  createCommit(store<TStore>(), action('insertOne', entity), ({ type, args: [entity] }, oldState: StateOf<TStore>, store) => {
    const entityId = entity[store.idKey] as EntityIdOf<TStore>;
    const entityIds = coerceArray(oldState.ids);

    if (entityIds.includes(entityId)) {
      return oldState;
    }

    return {
      ...oldState,
      ids: [...entityIds, entityId],
      entities: {
        ...oldState.entities,
        [entityId]: entity,
      },
    };
  });
