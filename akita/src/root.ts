export const isBrowser = typeof window !== 'undefined';
export const isNotBrowser = !isBrowser;
export const isNativeScript = typeof global !== 'undefined' && (<any>global).__runtimeVersion !== 'undefined';
export const hasLocalStorage = () => {
  try {
    return typeof localStorage !== 'undefined';
  } catch (error) {
    return false;
  }
}
export const hasSessionStorage = () => {
  try {
    return typeof localStorage !== 'undefined';
  } catch (error) {
    return false;
  }
}
