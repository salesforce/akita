import { isNil } from './isNil';

// @interanl
export function assertEntityIdKey<T>(entity: T, idKey: string) {
  if (isNil(entity) === false && idKey in entity === false) {
    console.error(`Can't find entity's 'id' key. https://netbasal.gitbook.io/akita/entity-store/entity-store/entity-id`);
  }
  return true;
}
