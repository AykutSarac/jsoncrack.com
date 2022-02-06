import { FlowElement } from "react-flow-renderer";

export const parser = (input: string | string[]): FlowElement[] => {
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
        data: {
          label: Object.fromEntries(
            Object.entries(o).filter(
              ([k, v]) => !Array.isArray(v) && !(v instanceof Object)
            )
          ),
        },
        position: { x: 0, y: 0 },
        type: "special",
        children: Object.entries(o)
          .filter(([k, v]) => Array.isArray(v) || typeof v === "object")
          .flatMap(([k, v]) => [
            {
              id: nextId(),
              data: { label: k },
              position: { x: 0, y: 0 },
              children: extract(v, nextId),
              type: "special",
            },
          ]),
      }));
    };

    const relationships = (xs: { id: string; children: never[] }[]) => {
      return xs.flatMap(({ id: target, children = [] }) => [
        ...children.map(({ id: source }) => ({
          id: `e${source}-${target}`,
          source,
          target,
        })),
        ...relationships(children),
      ]);
    };

    const flatten = (xs: { id: string; children: never[] }[]) =>
      xs.flatMap(({ children, ...rest }) => [rest, ...flatten(children)]);

    const res = extract(input);

    return [...flatten(res), ...relationships(res)];
  } catch (error) {
    console.error("An error occured while parsin JSON data!");
    return [];
  }
};
