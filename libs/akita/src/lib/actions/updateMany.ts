import { EntityIdOf, EntityOf, EntityStore } from '../entityStore';
import { StateOf } from '../store';
import { Action, newActionType } from './core/action';
import { ActionArgsOf, ActionOf, Commit } from './core/commit';
import { EntityStoreUtils } from './utils/entityStoreUtils';

export const UpdateManyType = 'UPDATE_MANY' as const;

export class UpdateMany<TStore extends EntityStore> extends Commit<TStore, Action<typeof UpdateManyType, (ids: EntityIdOf<TStore>[], entityUpdate: Partial<EntityOf<TStore>>) => void>> {
  static type = UpdateManyType;

  static Type = <TStore extends EntityStore>() => newActionType<UpdateMany<TStore>>(UpdateManyType);

  constructor(...args: ActionArgsOf<UpdateMany<TStore>>) {
    super({ type: UpdateMany.type, args });
  }

  reduce({ args: [ids, entityUpdate] }: ActionOf<this>, state: StateOf<TStore>, store: TStore): StateOf<TStore> {
    return EntityStoreUtils.updateMany(store, state, ids, entityUpdate);
  }
}

/**
 * Update many entities.
 */
export function updateMany<TStore extends EntityStore>(...args: ActionArgsOf<UpdateMany<TStore>>) {
  return new UpdateMany(...args);
}
