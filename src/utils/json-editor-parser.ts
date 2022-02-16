import toast from "react-hot-toast";

export const parser = (input: string | string[]) => {
  try {
    if (typeof input !== "object") input = JSON.parse(input);
    if (!Array.isArray(input)) input = [input];

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
        text: Object.fromEntries(
          Object.entries(o).filter(
            ([k, v]) => !Array.isArray(v) && !(v instanceof Object)
          )
        ),
        children: Object.entries(o)
          .filter(([k, v]) => Array.isArray(v) || typeof v === "object")
          .flatMap(([k, v]) => [
            {
              id: nextId(),
              text: k,
              children: extract(v, nextId),
            },
          ]),
      }));
    };

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

    const flatten = (xs: { id: string; children: never[] }[]) =>
      xs.flatMap(({ children, ...rest }) => [rest, ...flatten(children)]);

    const res = extract(input);

    return [...flatten(res), ...relationships(res)];
  } catch (error) {
    toast.error("An error occured while parsing JSON data!");
    return [];
  }
};
