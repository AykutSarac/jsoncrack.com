type TextColorOptions = {
  type?: string;
  value?: string | number | null | boolean;
};

export const getTextColor = ({ type, value }: TextColorOptions) => {
  if (value === null) return "var(--node-null)";
  if (type === "object") return "var(--node-key)";
  if (type === "number") return "var(--node-integer)";
  if (value === true) return "var(--node-bool-true)";
  if (value === false) return "var(--node-bool-false)";
  return "var(--node-value)";
};
