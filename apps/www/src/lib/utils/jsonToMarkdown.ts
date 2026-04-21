interface NodeInfo {
  key: string;
  type: string;
  value: string;
  depth: number;
}

function getType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function getValueInfo(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  
  const type = getType(value);
  
  switch (type) {
    case "string":
      const str = value as string;
      return `"${str.length > 50 ? str.slice(0, 50) + "..." : str}"`;
    case "number":
    case "boolean":
      return String(value);
    case "array":
      const arr = value as unknown[];
      return `[${arr.length} items]`;
    case "object":
      const obj = value as Record<string, unknown>;
      const keys = Object.keys(obj);
      return `{${keys.length} keys}`;
    default:
      return String(value);
  }
}

function traverseJson(
  value: unknown,
  depth: number = 0,
  parentKey: string = "root",
  nodes: NodeInfo[] = []
): NodeInfo[] {
  const type = getType(value);
  const valueInfo = getValueInfo(value);
  
  nodes.push({
    key: parentKey,
    type,
    value: valueInfo,
    depth,
  });

  if (type === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    for (const [key, val] of Object.entries(obj)) {
      traverseJson(val, depth + 1, key, nodes);
    }
  } else if (type === "array") {
    const arr = value as unknown[];
    arr.forEach((val, index) => {
      traverseJson(val, depth + 1, `[${index}]`, nodes);
    });
  }

  return nodes;
}

export function jsonToMarkdownTable(jsonString: string): string {
  try {
    const json = JSON.parse(jsonString);
    const nodes = traverseJson(json);
    
    const tableHeader = "| Key | Type | Value |\n|-----|------|-------|\n";
    const tableRows = nodes.slice(1).map(node => {
      const indent = "  ".repeat(node.depth);
      const key = `${indent}${node.key}`;
      return `| ${key} | ${node.type} | ${node.value} |`;
    }).join("\n");
    
    const metadata = `# JSON Structure Export\n\nGenerated at: ${new Date().toISOString()}\n\n## Node Details\n\n`;
    
    return metadata + tableHeader + tableRows;
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
}
