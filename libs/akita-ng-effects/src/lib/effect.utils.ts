export function setMetadata(effect, propertyName) {
  Object.defineProperty(effect, 'isEffect', {
    enumerable: true,
    configurable: false,
    writable: false,
    value: true,
  });
  Object.defineProperty(effect, 'name', {
    enumerable: true,
    configurable: false,
    writable: false,
    value: propertyName,
  });
}
