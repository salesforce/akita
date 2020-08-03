import { EntityStore } from '../entityStore';
import { StateOf } from '../store';
import { Action, newActionType } from './core/action';
import { ActionArgsOf, ActionOf, Commit } from './core/commit';

export const RemoveAllType = 'REMOVE_ALL' as const;

export class RemoveAll<TStore extends EntityStore> extends Commit<TStore, Action<typeof RemoveAllType, () => void>> {
  static type = RemoveAllType;

  static Type = <TStore extends EntityStore>() => newActionType<RemoveAll<TStore>>(RemoveAllType);

  constructor(...args: ActionArgsOf<RemoveAll<TStore>>) {
    super({ type: RemoveAll.type, args });
  }

  reduce({}: ActionOf<this>, state: StateOf<TStore>, store: TStore): StateOf<TStore> {
    return {
      ...state,
      ids: [],
      entities: {},
    };
  }
}

/**
 * Remove all entities.
 */
export function removeAll<TStore extends EntityStore>(...args: ActionArgsOf<RemoveAll<TStore>>) {
  return new RemoveAll(...args);
}
