import { StateOf, Store } from '../../store';
import { Action } from './action';
import { Commit } from './commit';

/**
 * A middleware function that takes the store, an apply callback, a commit, and returns the new action and store state.
 */
export type CommitMiddleware<TStore extends Store> = (
  store: TStore,
  apply: (commit: Commit<TStore>) => { action: Action; state: StateOf<TStore> | undefined },
  commit: Commit<TStore>
) => { action: Action; state: StateOf<TStore> | undefined };

/**
 * Applies all middlewares.
 */
export function applyCommitMiddlewares<TStore extends Store>(
  middlewares: CommitMiddleware<TStore>[],
  store: TStore,
  state: StateOf<TStore>,
  commit: Commit<TStore>,
  pointer = middlewares.length - 1
): { action: Action; state: StateOf<TStore> | undefined } {
  if (pointer < 0) {
    return {
      action: commit.action,
      state: commit.reduce(commit.action, state, store),
    };
  } else {
    return middlewares[pointer](this, (commit) => applyCommitMiddlewares(middlewares, store, state, commit, pointer - 1), commit);
  }
}
