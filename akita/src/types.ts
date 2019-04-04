import { SortByOptions } from './queryConfig';
import { BehaviorSubject, Observable } from 'rxjs';

export interface HashMap<T> {
  [id: string]: T;
}

export interface EntityState<E = any, ErrorT = any> {
  entities?: HashMap<E>;
  ids?: ID[];
  loading?: boolean;
  error?: ErrorT;
  [key: string]: any;
}

export interface Entities<E> {
  entities: HashMap<E>;
  ids: ID[];
}

export interface ActiveState<T = ID> {
  active: T | null;
}

export interface MultiActiveState<T = ID> {
  active: T[];
}

export interface SelectOptions<E> extends SortByOptions<E> {
  asObject?: boolean;
  filterBy?: ((entity: E, index?: number) => boolean) | ((entity: E, index?: number) => boolean)[] | undefined;
  limitTo?: number;
}

export type StateWithActive<State> = State & (ActiveState | MultiActiveState);
export type UpdateStateCallback<State> = (state: Readonly<State>) => Partial<State>;
export type UpdateEntityPredicate<E> = (entity: Readonly<E>) => boolean;
export type ID = number | string;
export type IDS = ID | ID[];
export type PreAddEntity<Entity> = (entity: Entity) => Entity;
export type PreUpdateEntity<Entity> = (prevEntity: Entity, nextEntity: Entity) => Entity;

export type StoreCache = {
  active: BehaviorSubject<boolean>;
  ttl: number;
};
export type ArrayProperties<T> = { [K in keyof T]: T[K] extends any[] ? K : never }[keyof T];
export type ItemPredicate<Item = any> = (item: Item) => boolean;
export type MaybeAsync<T = any> = Promise<T> | Observable<T> | T;
export type EntityUICreateFn<EntityUI = any, Entity = any> = EntityUI | ((entity: Entity) => EntityUI);
export type Constructor<T = any> = new(...args: any[]) => T;
