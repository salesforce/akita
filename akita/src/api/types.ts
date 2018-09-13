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
  active: T;
}

/** Entity id interface */
export type ID = number | string;

export type IDS = ID | ID[];

export type Newable<T> = { new (...args: any[]): T };
