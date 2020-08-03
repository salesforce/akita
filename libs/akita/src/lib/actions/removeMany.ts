import { EntityIdOf, EntityStore } from '../entityStore';
import { StateOf } from '../store';
import { Action, newActionType } from './core/action';
import { ActionArgsOf, ActionOf, Commit } from './core/commit';
import { EntityStoreUtils } from './utils/entityStoreUtils';

export const RemoveManyType = 'REMOVE_MANY' as const;

export class RemoveMany<TStore extends EntityStore> extends Commit<TStore, Action<typeof RemoveManyType, (entityIds: EntityIdOf<TStore>[]) => void>> {
  static type = RemoveManyType;

  static Type = <TStore extends EntityStore>() => newActionType<RemoveMany<TStore>>(RemoveManyType);

  constructor(...args: ActionArgsOf<RemoveMany<TStore>>) {
    super({ type: RemoveMany.type, args });
  }

  reduce({ args: [entityIds] }: ActionOf<this>, state: StateOf<TStore>, store: TStore): StateOf<TStore> {
    return EntityStoreUtils.removeMany(store, state, entityIds);
  }
}

/**
 * Remove many entities by id.
 */
export function removeMany<TStore extends EntityStore>(...args: ActionArgsOf<RemoveMany<TStore>>) {
  return new RemoveMany(...args);
}
