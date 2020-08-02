import { EntityIdOf, EntityOf, EntityStore } from '../entityStore';
import { StateOf } from '../store';
import { Action, newActionType } from './core/action';
import { ActionArgsOf, ActionOf, Commit } from './core/commit';
import { EntityStoreUtils } from './utils/entityStoreUtils';

export const UpdateOneByFnType = 'UPDATE_ONE_BY_FN' as const;

export class UpdateOneByFn<TStore extends EntityStore> extends Commit<
  TStore,
  Action<typeof UpdateOneByFnType, (predicate: (id: EntityIdOf<TStore>, entity: EntityOf<TStore>) => boolean, update: Partial<EntityOf<TStore>>) => void>
> {
  static type = UpdateOneByFnType;

  static Type = <TStore extends EntityStore>() => newActionType<UpdateOneByFn<TStore>>(UpdateOneByFnType);

  constructor(...args: ActionArgsOf<UpdateOneByFn<TStore>>) {
    super({ type: UpdateOneByFn.type, args });
  }

  reduce({ args: [predicate, update] }: ActionOf<this>, state: StateOf<TStore>, store: TStore): StateOf<TStore> {
    const [id, entity] = Object.entries(state.entities).find(predicate) ?? [];

    // If no entity id is found, then return the current state.
    if (id === undefined) {
      return state;
    }

    return EntityStoreUtils.updateOne(store, state, id, entity);
  }
}

/**
 * Update one entity by predicate function.
 */
export function updateOneByFn<TStore extends EntityStore>(...args: ActionArgsOf<UpdateOneByFn<TStore>>) {
  return new UpdateOneByFn(...args);
}
