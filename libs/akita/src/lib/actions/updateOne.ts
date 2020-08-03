import { EntityIdOf, EntityOf, EntityStore } from '../entityStore';
import { StateOf } from '../store';
import { Action, newActionType } from './core/action';
import { ActionArgsOf, ActionOf, Commit } from './core/commit';
import { EntityStoreUtils } from './utils/entityStoreUtils';

export const UpdateOneType = 'UPDATE_ONE' as const;

export class UpdateOne<TStore extends EntityStore> extends Commit<TStore, Action<typeof UpdateOneType, (id: EntityIdOf<TStore>, entityUpdate: Partial<EntityOf<TStore>>) => void>> {
  static type = UpdateOneType;

  static Type = <TStore extends EntityStore>() => newActionType<UpdateOne<TStore>>(UpdateOneType);

  constructor(...args: ActionArgsOf<UpdateOne<TStore>>) {
    super({ type: UpdateOne.type, args });
  }

  reduce({ args: [id, entityUpdate] }: ActionOf<this>, state: StateOf<TStore>, store: TStore): StateOf<TStore> {
    return EntityStoreUtils.updateOne(store, state, id, entityUpdate);
  }
}

/**
 * Update one entity.
 */
export function updateOne<TStore extends EntityStore>(...args: ActionArgsOf<UpdateOne<TStore>>) {
  return new UpdateOne(...args);
}
