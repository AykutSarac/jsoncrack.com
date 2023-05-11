export function getObjectValues(obj: object) {
  if (!obj) return [];
  let values = [] as string[];

  for (const key in obj) {
    if (typeof obj[key] === "object") {
      values = values.concat(getObjectValues(obj[key]));
    } else {
      values.push(obj[key]);
    }
  }

  return [...new Set(values)];
}
