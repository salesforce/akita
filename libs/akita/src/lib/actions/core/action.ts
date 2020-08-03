import { Constructor } from '../../types';
import { Commit } from './commit';

export interface ActionType<TType extends string> {
  type: TType;
}

export interface Action<TType extends string = string, TArgs extends (...args: any[]) => void = (...args: any[]) => void> extends ActionType<TType> {
  __ARGS__?: TArgs;
  args: Parameters<TArgs>;
}

export function newActionType<TCommit extends Commit<any, any>>(type: TCommit['action']['type']) {
  return ({ type } as unknown) as Constructor<TCommit> & { type: TCommit['action']['type'] };
}
