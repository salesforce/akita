export let __DEV__ = true;

export function enableAkitaProdMode() {
  __DEV__ = false;
  delete (window as any).$$stores;
  delete (window as any).$$queries;
}

// @internal
export function isDev() {
  return __DEV__;
}
