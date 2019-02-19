export class AkitaError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function assertStoreHasName(name: string, className: string) {
  if (!name) {
    console.error(`@StoreConfig({ name }) is missing in ${className}`);
  }
}
