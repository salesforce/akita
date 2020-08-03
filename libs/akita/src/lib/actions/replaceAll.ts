import { EntityOf, EntityStore } from '../entityStore';
import { StateOf } from '../store';
import { Action, newActionType } from './core/action';
import { ActionArgsOf, ActionOf, Commit } from './core/commit';
import { EntityStoreUtils } from './utils/entityStoreUtils';

export const ReplaceAllType = 'REPLACE_ALL' as const;

export class ReplaceAll<TStore extends EntityStore> extends Commit<TStore, Action<typeof ReplaceAllType, (entities: EntityOf<TStore>[]) => void>> {
  static type = ReplaceAllType;

  static Type = <TStore extends EntityStore>() => newActionType<ReplaceAll<TStore>>(ReplaceAllType);

  constructor(...args: ActionArgsOf<ReplaceAll<TStore>>) {
    super({ type: ReplaceAll.type, args });
  }

  reduce({ args: [entities] }: ActionOf<this>, state: StateOf<TStore>, store: TStore): StateOf<TStore> {
    return EntityStoreUtils.replaceAll(store, state, entities);
  }
}

export function replaceAll<TStore extends EntityStore>(...args: ActionArgsOf<ReplaceAll<TStore>>) {
  return new ReplaceAll(...args);
}
