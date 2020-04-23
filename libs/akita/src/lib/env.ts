let __DEV__ = true;

export function enableAkitaProdMode(): void {
  __DEV__ = false;
}

/** @internal */
export function isDev(): boolean {
  return __DEV__;
}
