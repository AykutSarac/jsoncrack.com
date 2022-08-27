/**
 * Copyright (C) 2022 Aykut Saraç - All Rights Reserved
 */
import toast from "react-hot-toast";

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

function generateChildren(object: Object, nextId: () => string) {
  if (!(object instanceof Object)) object = [object];

  return Object.entries(object)
    .filter(filterChild)
    .flatMap(([k, v]) => {
      // const isObject = v instanceof Object && !Array.isArray(v);

      // if (isObject) {
      //   return [
      //     {
      //       id: nextId(),
      //       text: k,
      //       parent: true,
      //       children: generateChildren(v, nextId),
      //     },
      //   ];
      // }

      return [
        {
          id: nextId(),
          text: k,
          parent: true,
          children: extract(v, nextId),
        },
      ];
    });
}

function generateNodeData(object: Object | number) {
  const isObject = object instanceof Object;

  if (isObject) {
    const entries = Object.entries(object).filter(filterValues);
    return Object.fromEntries(entries);
  }

  return String(object);
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
