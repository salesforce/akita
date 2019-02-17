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

export interface EntityState<E = any, ErrorT = any> {
  entities?: HashMap<E>;
  ids?: ID[];
  loading?: boolean;
  error?: ErrorT;

  // This is for stores that doesn't implements the EntityState interface
  [key: string]: any;
}

export interface Entities<E> {
  entities: HashMap<E>;
  ids: ID[];
}

/**
 * Interface for stores that needs an active indication
 */
export interface ActiveState<T = ID> {
  active: T | null;
}

export type ID = number | string;

export type IDS = ID | ID[];

export type Constructor<T = any> = { new (...args: any[]): T };

export type SetActiveOptions = { prev?: boolean; next?: boolean; wrap?: boolean };

export interface MultiActiveState<T = ID> {
  active: T[];
}

export type UpdateStateCallback<State> = (state: Readonly<State>) => Partial<State>;
export type UpdateEntityPredicate<E> = (entity: Readonly<E>) => boolean;
