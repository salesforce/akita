export let __DEV__ = true;

export function enableAkitaProdMode() {
  __DEV__ = false;
}

export function isDev() {
  return __DEV__;
}
