import { EntityIdOf, EntityOf, EntityStore } from '../entityStore';
import { StateOf } from '../store';
import { Action, newActionType } from './core/action';
import { ActionArgsOf, ActionOf, Commit } from './core/commit';
import { EntityStoreUtils } from './utils/entityStoreUtils';

export const UpdateManyByFnType = 'UPDATE_MANY_BY_FN' as const;

export class UpdateManyByFn<TStore extends EntityStore> extends Commit<
  TStore,
  Action<typeof UpdateManyByFnType, (predicate: (id: EntityIdOf<TStore>, entity: EntityOf<TStore>) => boolean, entityUpdate: Partial<EntityOf<TStore>>) => void>
> {
  static type = UpdateManyByFnType;

  static Type = <TStore extends EntityStore>() => newActionType<UpdateManyByFn<TStore>>(UpdateManyByFnType);

  constructor(...args: ActionArgsOf<UpdateManyByFn<TStore>>) {
    super({ type: UpdateManyByFn.type, args });
  }

  reduce({ args: [predicate, entityUpdate] }: ActionOf<this>, state: StateOf<TStore>, store: TStore): StateOf<TStore> {
    const ids = Object.entries(state.entities)
      .filter(predicate)
      .map((entity) => entity[store.idKey] as EntityIdOf<TStore>);

    // If no entity id is found, then return the current state.
    if (ids.length === 0) {
      return state;
    }

    return EntityStoreUtils.updateMany(store, state, ids, entityUpdate);
  }
}

export function updateManByFn<TStore extends EntityStore>(...args: ActionArgsOf<UpdateManyByFn<TStore>>) {
  return new UpdateManyByFn(...args);
}
