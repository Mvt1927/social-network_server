export function removeKeys<T>(
  obj: T,
  keys: string[],
): Omit<T, keyof typeof keys> {
  if (keys.length === 0) {
    return obj;
  }
  const newObj = { ...obj };
  for (const key of keys) {
    delete newObj[key];
  }
  return newObj;
}
