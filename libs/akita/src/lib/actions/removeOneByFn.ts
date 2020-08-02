import { EntityIdOf, EntityOf, EntityStore } from '../entityStore';
import { StateOf } from '../store';
import { Action, newActionType } from './core/action';
import { ActionArgsOf, ActionOf, Commit } from './core/commit';
import { EntityStoreUtils } from './utils/entityStoreUtils';

export const RemoveOneByFnType = 'REMOVE_ONE_BY_FN' as const;

export class RemoveOneByFn<TStore extends EntityStore> extends Commit<TStore, Action<typeof RemoveOneByFnType, (predicate: (id: EntityIdOf<TStore>, entity: EntityOf<TStore>) => boolean) => void>> {
  static type = RemoveOneByFnType;

  static Type = <TStore extends EntityStore>() => newActionType<RemoveOneByFn<TStore>>(RemoveOneByFnType);

  constructor(...args: ActionArgsOf<RemoveOneByFn<TStore>>) {
    super({ type: RemoveOneByFn.type, args });
  }

  reduce({ args: [predicate] }: ActionOf<this>, state: StateOf<TStore>, store: TStore): StateOf<TStore> {
    const id = Object.keys(state.entities).find(predicate);

    // If no entity id is found, then return the current state.
    if (id === undefined) {
      return state;
    }

    return EntityStoreUtils.removeMany(store, state, [id]);
  }
}

export function removeOneByFn<TStore extends EntityStore>(...args: ActionArgsOf<RemoveOneByFn<TStore>>) {
  return new RemoveOneByFn(...args);
}
