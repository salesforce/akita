import { coerceArray } from '@datorama/akita';
import { EntityState, getEntityType, getIDType, ID } from '../types';

export interface ReducerContext<TActionType extends string, TActionArgs extends any[]> {
  action: { type: TActionType; args: TActionArgs };
}

export interface EntityReducerContext<TActionType extends string, TActionArgs extends any[]> extends ReducerContext<TActionType, TActionArgs> {
  idKey: string;
}

export interface Reducer<TActionType extends string, TActionArgs extends any[], S> {
  (...args: TActionArgs): (state: S, context: ReducerContext<TActionType, TActionArgs>) => S;
}

export interface EntityReducer<TActionType extends string, TActionArgs extends any[], S extends EntityState<EntityType, IdType>, EntityType = getEntityType<S>, IdType extends ID = getIDType<S>> {
  (...args: TActionArgs): (state: S, context: EntityReducerContext<TActionType, TActionArgs>) => S;
}

export interface Action<TActionType extends string, TActionArgs extends any[]> {
  type: TActionType;
  args: TActionArgs;
}

export interface Commit<TActionType extends string, TActionArgs extends any[], TReducer extends Reducer<TActionType, TActionArgs, S>, S> {
  action: Action<TActionType, TActionArgs>;
  reducer: TReducer;
}

function createStateCommit<TActionType extends string, TActionArgs extends any[], TReducer extends Reducer<TActionType, TActionArgs, S>, S>(
  action: { type: TActionType; args: TActionArgs },
  reducer: TReducer
): Commit<TActionType, TActionArgs, TReducer, S> {
  return { action, reducer };
}

function createEntityStateCommit<
  TActionType extends string,
  TActionArgs extends any[],
  TReducer extends EntityReducer<TActionType, TActionArgs, S, EntityType, IdType>,
  S,
  EntityType = getEntityType<S>,
  IdType extends ID = getIDType<S>
>(action: { type: TActionType; args: TActionArgs }, reducer: TReducer): Commit<TActionType, TActionArgs, TReducer, S> {
  return { action, reducer };
}

/**
 *
 * @param state
 */
export const update = <S>(state: Partial<S>) =>
  createEntityStateCommit({ type: 'update', args: [state] }, (newState) => (oldState: S, context) => {
    return { ...oldState, ...newState };
  });

/**
 *
 * @param entity
 */
export const insertOne = <S extends EntityState<EntityType, IdType>, EntityType = getEntityType<S>, IdType extends ID = getIDType<S>>(entity: EntityType) =>
  createEntityStateCommit({ type: 'insertOne', args: [entity] }, (entity) => (state: S, context) => {
    const entityId = entity[context.idKey] as IdType;
    const entityIds = coerceArray(state.ids);

    if (entityIds.includes(entityId)) {
      return state;
    }

    return {
      ...state,
      ids: [...entityIds, entityId],
      entities: {
        ...state.entities,
        [entityId]: entity,
      },
    };
  });
