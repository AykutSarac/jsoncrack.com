export function getAllPaths(jsonObj: string) {
  if (!jsonObj) return [];

  jsonObj = JSON.parse(jsonObj);
  let paths = [] as string[];

  function traverse(obj: string | object, path: string[]) {
    if (typeof obj !== "object") {
      paths.push(path.join("."));
      return;
    }

    for (let key in obj) {
      traverse(obj[key], path.concat(key));
    }
  }

  traverse(jsonObj, []);

  return paths;
}
