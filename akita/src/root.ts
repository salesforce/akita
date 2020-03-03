export const isBrowser = typeof window !== 'undefined';
export const isNotBrowser = !isBrowser;
export const isNativeScript = typeof global !== 'undefined' && (<any>global).__runtimeVersion !== 'undefined';
export const hasLocalStorage = () => {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}
export const hasSessionStorage = () => {
  try {
    return typeof sessionStorage !== 'undefined';
  } catch {
    return false;
  }
}
