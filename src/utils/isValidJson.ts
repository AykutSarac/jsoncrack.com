export const isValidJson = (str: string) => {
  try {
    var obj = JSON.parse(str);
    if (obj && typeof obj === "object") return obj;
  }
  catch (e) { }
  return false;
};
