export let __DEV__ = true;

export function enableAkitaProdMode() {
  __DEV__ = false;
}

// @internal
export function isDev() {
  return __DEV__;
}
