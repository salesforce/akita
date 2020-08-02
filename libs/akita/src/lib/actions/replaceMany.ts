import { EntityOf, EntityStore } from '../entityStore';
import { StateOf } from '../store';
import { Action, newActionType } from './core/action';
import { ActionArgsOf, ActionOf, Commit } from './core/commit';
import { EntityStoreUtils } from './utils/entityStoreUtils';

export const ReplaceManyType = 'REPLACE_MANY' as const;

export class ReplaceMany<TStore extends EntityStore> extends Commit<TStore, Action<typeof ReplaceManyType, (entities: EntityOf<TStore>[], options?: { allowInsert: boolean }) => void>> {
  static type = ReplaceManyType;

  static Type = <TStore extends EntityStore>() => newActionType<ReplaceMany<TStore>>(ReplaceManyType);

  constructor(...args: ActionArgsOf<ReplaceMany<TStore>>) {
    super({ type: ReplaceMany.type, args });
  }

  reduce({ args: [entities, options] }: ActionOf<this>, state: StateOf<TStore>, store: TStore): StateOf<TStore> {
    return EntityStoreUtils.replaceMany(store, state, entities, options);
  }
}

export function replaceMany<TStore extends EntityStore>(...args: ActionArgsOf<ReplaceMany<TStore>>) {
  return new ReplaceMany(...args);
}
