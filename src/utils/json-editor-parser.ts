import toast from "react-hot-toast";

const filterChild = ([k, v]) => {
  const notNull = v !== null;
  const isArray = Array.isArray(v);
  const condition = isArray ? !!v.length : typeof v === "object";
  return notNull && condition;
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

  return !isObject
    ? object.toString()
    : Object.fromEntries(
        Object.entries(object).filter(
          ([k, v]) => !Array.isArray(v) && !(v instanceof Object)
        )
      );
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
  return xs.flatMap(({ id: to, children = [] }) => [
    ...children.map(({ id: from }) => ({
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
    console.log(error);

    toast.error("An error occured while parsing JSON data!");
    return [];
  }
};
