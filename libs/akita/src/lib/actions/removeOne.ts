import { coerceArray } from '../coerceArray';
import { EntityIdOf, EntityStore } from '../entityStore';
import { StateOf } from '../store';
import { Action, newActionType } from './core/action';
import { ActionArgsOf, ActionOf, Commit } from './core/commit';
import { EntityStoreUtils } from './utils/entityStoreUtils';

export const RemoveOneType = 'REMOVE_ONE' as const;

export class RemoveOne<TStore extends EntityStore> extends Commit<TStore, Action<typeof RemoveOneType, (id: EntityIdOf<TStore>) => void>> {
  static type = RemoveOneType;

  static Type = <TStore extends EntityStore>() => newActionType<RemoveOne<TStore>>(RemoveOneType);

  constructor(...args: ActionArgsOf<RemoveOne<TStore>>) {
    super({ type: RemoveOne.type, args });
  }

  reduce({ args: [id] }: ActionOf<this>, state: StateOf<TStore>, store: TStore): StateOf<TStore> {
    const ids = coerceArray(state.ids);

    // If the entity id does not exist, then return current state.
    if (!ids.includes(id)) {
      return state;
    }

    return EntityStoreUtils.removeMany(store, state, [id]);
  }
}

/**
 * Remove one entity.
 */
export function removeOne<TStore extends EntityStore>(...args: ActionArgsOf<RemoveOne<TStore>>) {
  return new RemoveOne(...args);
}
