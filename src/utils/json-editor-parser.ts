/**
 * Copyright (C) 2022 Aykut Saraç - All Rights Reserved
 */
import toast from "react-hot-toast";

const filterChild = ([k, v]) => {
  const isNull = v === null;
  const isArray = Array.isArray(v) && v.length;
  const isObject = v instanceof Object;

  return !isNull && (isArray || isObject);
};

const filterValues = ([k, v]) => {
  if (Array.isArray(v) || v instanceof Object) return false;

  return true;
};

function generateChildren(object: Object, nextId: () => string, parent_id: string) {
  if (!(object instanceof Object)) object = [object];

  return Object.entries(object)
    .filter(filterChild)
    // .map(([k, v]) => [k, v])
    .map(([k, v]) => [k, v, nextId()])
    .map(([k, v, id]) => {
      return [
        {
          id: id,
          text: k,
          parent: true,
          parent_id,
          children: extractTree(v, nextId, id),
        },
      ];
    })
    .flat(); // TODO: reduce to flatMap
}

function generateNodeData(object: Object | number) {
  const isObject = object instanceof Object;

  if (isObject) {
    const entries = Object.entries(object).filter(filterValues);
    return Object.fromEntries(entries);
  }

  return String(object);
}

export const extractTree = (
  os: string[] | object[] | null,
  nextId = (
    (id) => () =>
      String(++id)
  )(0),
  parent_id: string | null,
) => {
  if (!os) return [];
  if (parent_id == undefined) parent_id = null;

  return [os]
    .flat()
    .map((o) => [o, nextId()])
    .map(([o, id]) => ({
      id,
      text: generateNodeData(o),
      parent_id,
      children: generateChildren(o, nextId, id),
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

export const flattenTree = tree => {
  const res = [...flatten(tree), ...relationships(tree)];
  return res;
};
 
export const parser = (input: string | string[]) => {
  try {
    if (!Array.isArray(input)) input = [input];

    const mappedElements = extractTree(input, null);
    const res = [...flatten(mappedElements), ...relationships(mappedElements)];

    return res;
  } catch (error) {
    console.error(error);
    toast.error("An error occured while parsing JSON data!");
    return [];
  }
};

export const privateMethods = {
  relationships, flatten, filterChild, generateChildren,
}
