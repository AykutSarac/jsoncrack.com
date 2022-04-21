import toast from "react-hot-toast";

const extract = (
  os: string[] | object[] | null,
  nextId = (
    (id) => () =>
      String(++id)
  )(0)
) => {
  if (!os) return {};
  return [os].flat().map((o) => {
    const isObject = o instanceof Object;

    return {
      id: nextId(),
      text: !isObject
        ? o.toString()
        : Object.fromEntries(
            Object.entries(o).filter(
              ([k, v]) => !Array.isArray(v) && !(v instanceof Object)
            )
          ),
      parent: false,
      children: Object.entries(o)
        .filter(([k, v]) => Array.isArray(v) || typeof v === "object")
        .flatMap(([k, v]) => [
          {
            id: nextId(),
            text: k,
            parent: true,
            children: extract(v, nextId),
          },
        ]),
    };
  });
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

    console.log(res);

    return res;
  } catch (error) {
    toast.error("An error occured while parsing JSON data!");
    return [];
  }
};
