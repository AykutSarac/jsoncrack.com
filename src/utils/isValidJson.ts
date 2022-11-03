import { parse } from "jsonc-parser";

export const isValidJson = (str: string) => {
  try {
    parse(str);
  } catch (e) {
    return false;
  }
  return str;
};
