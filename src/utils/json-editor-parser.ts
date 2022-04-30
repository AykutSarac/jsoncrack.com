import toast from "react-hot-toast";

const filterChild = ([k, v]) => {
  const notNull = v !== null;
  const isArray = Array.isArray(v) ? !!v.length : typeof v === "object";
  return notNull && isArray;
};

const filterValues = ([k, v]) => {
  if (Array.isArray(v) || v instanceof Object) return false;

  return true;
};

function generateChildren(object: Object, nextId: () => string) {
  return Object.entries(object)
    .filter(filterChild)
    .flatMap(([k, v]) => [
      {
        id: nextId(),
        text: k,
        parent: true,
        children: extract(v, nextId),
      },
    ]);
}

function generateNodeData(object: Object | number) {
  const isObject = object instanceof Object;

  if (isObject) {
    const entries = Object.entries(object).filter(filterValues);
    return Object.fromEntries(entries);
  }

  return object.toString();
}

const extract = (
  os: string[] | object[] | null,
  nextId = (
    (id) => () =>
      String(++id)
  )(0)
) => {
  if (!os) return [];
  return [os].flat().map((o) => ({
    id: nextId(),
    text: generateNodeData(o),
    children: generateChildren(o, nextId),
    parent: false,
  }));
};

const flatten = (xs: { id: string; children: never[] }[]) =>
  xs.flatMap(({ children, ...rest }) => [rest, ...flatten(children)]);

const relationships = (xs: { id: string; children: never[] }[]) => {
  return xs.flatMap(({ id: from, children = [] }) => [
    ...children.map(({ id: to }) => ({
      id: `e${from}-${to}`,
      from,
      to,
    })),
    ...relationships(children),
  ]);
};

export const parser = (input: string | string[]) => {
  try {
    if (typeof input !== "object") input = JSON.parse(input);
    if (!Array.isArray(input)) input = [input];

    const mappedElements = extract(input);
    const res = [...flatten(mappedElements), ...relationships(mappedElements)];

    return res;
  } catch (error) {
    console.error(error);

    toast.error("An error occured while parsing JSON data!");
    return [];
  }
};
