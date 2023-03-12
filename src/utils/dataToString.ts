export const dataToString = (data: any) => {
  const text = Array.isArray(data) ? Object.fromEntries(data) : data;
  return JSON.stringify(
    text,
    (_, v) => {
      if (typeof v === "string") return v.replaceAll('"', "");
      return v;
    },
    2
  );
};
