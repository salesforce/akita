import { EntityOf, EntityStore } from '../entityStore';
import { StateOf } from '../store';
import { Action, newActionType } from './core/action';
import { ActionArgsOf, ActionOf, Commit } from './core/commit';
import { EntityStoreUtils } from './utils/entityStoreUtils';

export const InsertManyType = 'INSERT_MANY' as const;

export class InsertMany<TStore extends EntityStore> extends Commit<TStore, Action<typeof InsertManyType, (entities: EntityOf<TStore>[]) => void>> {
  static type = InsertManyType;

  static Type = <TStore extends EntityStore>() => newActionType<InsertMany<TStore>>(InsertManyType);

  constructor(...args: ActionArgsOf<InsertMany<TStore>>) {
    super({ type: InsertMany.type, args });
  }

  reduce({ args: [entities] }: ActionOf<this>, state: StateOf<TStore>, store: TStore): StateOf<TStore> {
    return EntityStoreUtils.insertMany(store, state, entities);
  }
}

/**
 * Insert many entities.
 */
export function insertMany<TStore extends EntityStore>(...args: ActionArgsOf<InsertMany<TStore>>) {
  return new InsertMany(...args);
}
