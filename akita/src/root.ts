export const isBrowser = typeof window !== 'undefined';
export const isNativeScript = typeof global !== 'undefined' && typeof (<any>global).__runtimeVersion !== 'undefined';

// @internal
export const isNotBrowser = !isBrowser || isNativeScript;
