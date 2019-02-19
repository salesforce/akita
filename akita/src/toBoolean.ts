export function toBoolean(value: any): boolean {
  return value != null && `${value}` !== 'false';
}
