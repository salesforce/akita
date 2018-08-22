import { entityExists, isObject, toBoolean } from './utils';
import { EntityState, ID } from '../api/types';

export class AkitaError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AkitaImmutabilityError extends AkitaError {
  constructor(storeName) {
    super(`The new state should be immutable. Make sure to return a new immutable state. \n store: \n ${storeName}`);
  }
}

export class AkitaEntityNotExistsError extends AkitaError {
  constructor(id) {
    super(`Entity ${id} does not exists`);
  }
}

export class AkitaNoActiveError extends AkitaError {
  constructor() {
    super(`Active is null/undefined`);
  }
}

export class AkitaInvalidEntityState extends AkitaError {
  constructor() {
    super(`Entity state is invalid`);
  }
}

export class AkitaUpdateIdKeyError extends AkitaError {
  constructor() {
    super(`Updating entity id is not permitted when updating many entities`);
  }
}

export function assertEntityExists(id: ID, entities) {
  if (!entityExists(id, entities)) {
    throw new AkitaEntityNotExistsError(id);
  }
}

export function assertActive(store) {
  if (!toBoolean(store.active)) {
    throw new AkitaNoActiveError();
  }
}

export function assertEntityState(state: EntityState<any>) {
  const assertEntities = isObject(state);

  if (!assertEntities) {
    throw new AkitaInvalidEntityState();
  }
}

export function assertDecorator(name: string, className: string) {
  if (!name) {
    console.error(`@StoreConfig({ name }) is missing in ${className}`);
  }
}
