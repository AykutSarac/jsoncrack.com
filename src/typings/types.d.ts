type CanvasDirection = "LEFT" | "RIGHT" | "DOWN" | "UP";

interface CustomNodeData {
  isParent: true;
  childrenCount: children.length;
  children: NodeData[];
}

interface NodeData<T = any> {
  id: string;
  disabled?: boolean;
  text?: any;
  height?: number;
  width?: number;
  parent?: string;
  ports?: PortData[];
  icon?: IconData;
  nodePadding?: number | [number, number] | [number, number, number, number];
  data?: T;
  className?: string;
  layoutOptions?: ElkNodeLayoutOptions;
  selectionDisabled?: boolean;
}

interface EdgeData<T = any> {
  id: string;
  disabled?: boolean;
  text?: any;
  from?: string;
  to?: string;
  fromPort?: string;
  toPort?: string;
  data?: T;
  className?: string;
  containerClassName?: string;
  arrowHeadType?: any;
  parent?: string;
  selectionDisabled?: boolean;
}
