import { EntityOf, EntityStore } from '../entityStore';
import { StateOf } from '../store';
import { Action, newActionType } from './core/action';
import { ActionArgsOf, ActionOf, Commit } from './core/commit';
import { EntityStoreUtils } from './utils/entityStoreUtils';

export const ReplaceOneType = 'REPLACE_ONE' as const;

export class ReplaceOne<TStore extends EntityStore> extends Commit<TStore, Action<typeof ReplaceOneType, (entity: EntityOf<TStore>, options?: { allowInsert: boolean }) => void>> {
  static type = ReplaceOneType;

  static Type = <TStore extends EntityStore>() => newActionType<ReplaceOne<TStore>>(ReplaceOneType);

  constructor(...args: ActionArgsOf<ReplaceOne<TStore>>) {
    super({ type: ReplaceOne.type, args });
  }

  reduce({ args: [entity, options] }: ActionOf<this>, state: StateOf<TStore>, store: TStore): StateOf<TStore> {
    return EntityStoreUtils.replaceMany(store, state, [entity], options);
  }
}

export function replaceOne<TStore extends EntityStore>(...args: ActionArgsOf<ReplaceOne<TStore>>) {
  return new ReplaceOne(...args);
}
