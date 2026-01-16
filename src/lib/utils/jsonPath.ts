export function setValueAtPath(jsonString: string, path: Array<string | number> | undefined, value: any) {
  const data = JSON.parse(jsonString);
  if (!path || path.length === 0) {
    return JSON.stringify(value, null, 2);
  }

  let cur: any = data;
  for (let i = 0; i < path.length - 1; i++) {
    const seg = path[i];
    if (typeof seg === "number") {
      cur = cur[seg];
    } else {
      cur = cur[seg as string];
    }
    if (cur === undefined || cur === null) break;
  }

  const last = path[path.length - 1];
  if (typeof last === "number") {
    cur[last] = value;
  } else {
    cur[last as string] = value;
  }

  return JSON.stringify(data, null, 2);
}

export function getValueAtPath(jsonString: string, path: Array<string | number> | undefined) {
  const data = JSON.parse(jsonString);
  if (!path || path.length === 0) return data;

  let cur: any = data;
  for (let i = 0; i < path.length; i++) {
    const seg = path[i];
    if (cur === undefined || cur === null) return undefined;
    cur = typeof seg === "number" ? cur[seg] : cur[seg as string];
  }

  return cur;
}
