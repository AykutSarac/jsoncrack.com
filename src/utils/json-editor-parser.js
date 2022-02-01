export function transform(source = [], result = [], nodeInfo = {}) {
  let { id = 0, parent = null, pAggregate = null, edgeItems = [] } = nodeInfo;

  const createEdgeItem = (id, pid) => ({
    id: `e${id}-${pid}`,
    source: id.toString(),
    target: pid.toString(),
  });

  if (Array.isArray(source)) {
    result.push(
      ...source.flatMap((item, idx) =>
        parser(item, [], {
          id: (id + idx).toString(),
          parent,
          pAggregate,
          edgeItems,
        })
      )
    );
  } else {
    Object.entries(source).forEach(([key, value], idx) => {
      const dataNode = {};

      if (value && (Array.isArray(value) || typeof value === "object")) {
        // every object's iterable property is supposed
        // to be created as an own parent entity.

        result.push(
          Object.assign(dataNode, {
            id: (++id).toString(),
            data: { label: key },
            position: { x: 0, y: 0 },
            type: "special",
          })
        );
        if (parent !== null) {
          edgeItems.push(createEdgeItem(id, parent.id));
        }
        parent = dataNode;

        result.push(
          ...parser(value, [], {
            id,
            parent,
            pAggregate,
            edgeItems,
          })
        );
      } else {
        if (idx === 0) {
          // every object's first property (though not iterable)
          // is supposed to be created as an own parent entity.

          result.push(
            Object.assign(dataNode, {
              id: (++id).toString(),
              data: { label: { [key]: value } },
              position: { x: 0, y: 0 },
              type: "special",
            })
          );
          if (parent !== null) {
            edgeItems.push(createEdgeItem(id, parent.id));
          }
          pAggregate = parent = dataNode;
        } else {
          // aggreagat all non interable properties at
          // most recent, recursion-free parent level.

          pAggregate.data.label[key] = value;
        }
      }
    });
  }
  if (parent === null) {
    // append all additionally collected edge items
    // in the end of all the recursion.

    result.push(...edgeItems);
  }
  return result;
}

export const parser = (input) => {
  const extract = (
    os,
    nextId = (
      (id) => () =>
        String(++id)
    )(0)
  ) =>
    os.map((o) => ({
      id: nextId(),
      data: {
        label: Object.fromEntries(
          Object.entries(o).filter(([k, v]) => !Array.isArray(v))
        ),
      },
      position: { x: 0, y: 0 },
      type: "special",
      children: Object.entries(o)
        .filter(([k, v]) => Array.isArray(v))
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

  const relationships = (xs) =>
    xs.flatMap(({ id: target, children = [] }) => [
      ...children.map(({ id: source }) => ({
        id: `e${source}-${target}`,
        source,
        target,
      })),
      ...relationships(children),
    ]);

  const flatten = (xs) =>
    xs.flatMap(({ children, ...rest }) => [rest, ...flatten(children)]);

  const res = extract(input);

  return [...flatten(res), ...relationships(res)];
};
