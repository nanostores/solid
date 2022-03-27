export function isPrimitive<T>(val: T): boolean {
  if (typeof val === 'object')
    return val === null;

  return typeof val !== 'function';
}
