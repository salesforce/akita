// @internal
export class AkitaError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// @internal
export function assertStoreHasName(name: string, className: string) {
  if (!name) {
    console.error(`@StoreConfig({ name }) is missing in ${className}`);
  }
}
