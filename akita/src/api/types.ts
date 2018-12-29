/**
 * An interface to represent objects
 *
 * @example
 * const dashboards: HashMap<Dashboard> = {
 *   1: Dashboard
 * }
 */
export interface HashMap<T> {
  [id: string]: T;
}

/**
 *  The Entity State is a predefined generic interface for a given collection
 *  with the following interface:
 *
 *  `ids`: An array of all the primary ids in the collection
 *  `entities`: A dictionary of entities in the collection indexed by the primary id
 */
export interface EntityState<E = any, ErrorT = any> {
  entities?: HashMap<E>;
  ids?: ID[];
  loading?: boolean;
  error?: ErrorT;
  /** This is for stores that doesn't implements the EntityState interface */
  [key: string]: any;
}

export interface Entities<E> {
  entities?: HashMap<E>;
  ids?: ID[];
}

/**
 * Interface for stores that needs an active indication
 */
export interface ActiveState<T = ID> {
  active: T | null;
}

/** Entity id interface */
export type ID = number | string;

export type IDS = ID | ID[];

export type Newable<T> = { new (...args: any[]): T };

/** Optional config for Store.add() to prepend entity or entities to stores */
export type AddOptions = { prepend?: boolean };

export type SetActiveOptions = { prev?: boolean; next?: boolean; wrap?: boolean };

export interface StoreOnInit {
  /**
   * A callback method that is invoked immediately after
   * the creation of a store with the initial state.
   * It is invoked only once when the store is instantiated.
   */
  storeOnInit(): void;
}

export interface StoreOnUpdate {
  /**
   * A callback method that is invoked immediately after
   * state change of a store, with the previous state and the new state
   * as parameters.
   */
  storeOnUpdate(previousState, newState): void;
}
