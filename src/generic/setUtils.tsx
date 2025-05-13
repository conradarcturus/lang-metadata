export function uniqueBy<T>(items: T[], keyFn: (item: T) => string | number): T[] {
  return Object.values(
    items.reduce<Record<string | number, T>>((dict, item) => {
      const key = keyFn(item);
      if (dict[key] == null) {
        dict[key] = item;
      }
      return dict;
    }, {}),
  );
}
