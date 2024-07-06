export type Primitive = string | number | boolean | bigint | symbol | undefined | null;

export type RecursiveToJSON<T> = T extends Primitive | ((...args: any[]) => any)
  ? T
  : T extends { toJSON: () => infer U }
    ? U
    : T extends Array<infer U>
      ? Array<RecursiveToJSON<U>>
      : { [K in keyof T]: RecursiveToJSON<T[K]> };

export const toJson = <T>(value: T, seen = new WeakSet()): RecursiveToJSON<T> => {
  // Handle primitive types and functions directly
  if (value === null || typeof value !== 'object' || typeof value === 'function') {
    return value as RecursiveToJSON<T>;
  }

  // Check for circular references
  if (seen.has(value)) {
    return '[Circular]' as RecursiveToJSON<T>;
  }
  seen.add(value);

  // Use toJSON method if available
  if ('toJSON' in value && typeof value.toJSON === 'function') {
    return toJson(value.toJSON(), seen);
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item) => toJson(item, seen)) as RecursiveToJSON<T>;
  }

  // Handle objects
  const result: Record<string, unknown> = {};
  Object.getOwnPropertyNames(value).forEach((prop) => {
    if (prop.startsWith('_')) return;
    const descriptor = Object.getOwnPropertyDescriptor(value, prop);
    if (descriptor && descriptor.value) {
      result[prop] = toJson(descriptor.value, seen);
    }
  });

  if (value instanceof Error) {
    result['name'] = value.name;
  }

  return result as RecursiveToJSON<T>;
};
