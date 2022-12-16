export const isJsonValid = (str: string): boolean => {
  try {
    return !!JSON.parse(str);
  } catch (e) {
    return false;
  }
};
