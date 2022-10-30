import { parse } from "jsonc-parser";

const calculateSize = (
  text: string | [string, string][],
  isParent = false,
  isFolded: boolean
) => {
  let value = "";

  if (typeof text === "string") value = text;
  else value = text.map(([k, v]) => `${k}: ${v}`).join("\n");

  const lineCount = value.split("\n");
  const lineLengths = lineCount.map(line => line.length);
  const longestLine = lineLengths.sort((a, b) => b - a)[0];

  const getWidth = () => {
    if (Array.isArray(text) && !text.length) return 40;
    if (!isFolded) return 35 + longestLine * 8 + (isParent ? 60 : 0);
    if (isParent) return 170;
    return 200;
  };

  const getHeight = () => {
    if (lineCount.length * 17.8 < 30) return 40;
    return (lineCount.length + 1) * 18;
  };

  return {
    width: getWidth(),
    height: getHeight(),
  };
};

const filterChild = ([_, v]) => {
  const isNull = v === null;
  const isArray = Array.isArray(v) && v.length;
  const isObject = v instanceof Object;

  return !isNull && (isArray || isObject);
};

const filterValues = ([k, v]) => {
  if (Array.isArray(v) || v instanceof Object) return false;
  return true;
};

function generateChildren(object: Object, isFolded = false, nextId: () => string) {
  if (!(object instanceof Object)) object = [object];

  return Object.entries(object)
    .filter(filterChild)
    .flatMap(([key, v]) => {
      const { width, height } = calculateSize(key, true, isFolded);
      const children = extract(v, isFolded, nextId);

      return [
        {
          id: nextId(),
          text: key,
          children,
          width,
          height,
          data: {
            isParent: true,
            childrenCount: children.length,
          },
        },
      ];
    });
}

function generateNodeData(object: Object) {
  if (object instanceof Object) {
    const entries = Object.entries(object).filter(filterValues);
    return entries;
  }

  return String(object);
}

const extract = (
  os: string[] | object[] | null,
  isFolded = false,
  nextId = (
    id => () =>
      String(++id)
  )(0)
) => {
  if (!os) return [];

  return [os].flat().map(o => {
    const text = generateNodeData(o);
    const { width, height } = calculateSize(text, false, isFolded);

    return {
      id: nextId(),
      text,
      width,
      height,
      children: generateChildren(o, isFolded, nextId),
      data: {
        isParent: false,
        childrenCount: 0,
        isEmpty: !text.length,
      },
    };
  });
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

export const parser = (jsonStr: string, isFolded = false) => {
  try {
    let json = parse(jsonStr);
    if (!Array.isArray(json)) json = [json];
    const nodes: NodeData[] = [];
    const edges: EdgeData[] = [];

    const mappedElements = extract(json, isFolded);
    const res = [...flatten(mappedElements), ...relationships(mappedElements)];

    res.forEach(data => {
      if (isNode(data)) {
        nodes.push(data);
      } else {
        edges.push(data);
      }
    });

    return { nodes, edges };
  } catch (error) {
    console.error(error);
    return {
      nodes: [],
      edges: [],
    };
  }
};

function isNode(element: NodeData | EdgeData) {
  if ("text" in element) return true;
  return false;
}
