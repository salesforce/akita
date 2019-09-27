export const isBrowser = typeof window !== 'undefined';
export const isNotBrowser = !isBrowser;
export const isNativeScript = typeof global !== 'undefined' && (<any>global).__runtimeVersion !== 'undefined';
