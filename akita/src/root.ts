const isBrowser = typeof window !== 'undefined';
const isNativeScript = typeof global !== 'undefined' && typeof (<any>global).__runtimeVersion !== 'undefined';

// @internal
export const isNotBrowser = !isBrowser && !isNativeScript;
