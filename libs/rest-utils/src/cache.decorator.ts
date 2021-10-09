export function LruCache(maxEntries = 0): MethodDecorator {
  const cache = new Map<any, any>();
  const history = new Array<any>();
  return (target, key, descriptor) => {
    const originalMethod = descriptor.value as unknown as (...args: any) => any;
    //@ts-expect-error We still can't get actually typesafe decorators definitions in TypeScript
    descriptor.value = (...args) => {
      if (!cache.has(args)) {
        if (maxEntries > 0 && history.length >= maxEntries) {
          const oldest = history.shift();
          cache.delete(oldest);
        }
        const value = originalMethod.apply(target, ...args);
        cache.set(args, value);
        return value;
      }
      return cache.get(args);
    };
  };
}
