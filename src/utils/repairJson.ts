import { toast } from "react-hot-toast";

/**
 * The ISC License
 * Copyright (c) 2023 by Aykut Saraç
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
 * THE SOFTWARE IS PROVIDED "AS IS" AND ISC DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL ISC BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
export function fixJSON(jsonString: string) {
  try {

    // Remove comments
    jsonString = jsonString.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, "");

    // Remove JSONP notation
    jsonString = jsonString.replace(/^\s*callback\((.*)\)\s*$/, "$1");

    // Remove escape characters from escaped strings
    jsonString = jsonString.replace(/\\"/g, '"');

    // Remove MongoDB data types
    jsonString = jsonString.replace(/(ISODate|NumberLong)\s*\(\s*("[^"]+"|\d+)\s*\)/g, "$2");

    // Replace Python constants with JSON equivalents
    jsonString = jsonString.replace(/(?<=^|\s)(None|True|False)(?=$|\s|,|\]|\})/g, match =>
      match.toLowerCase() === "none" ? "null" : match.toLowerCase()
    );

    // Concatenate strings
    jsonString = jsonString.replace(
      /"([^"\\]*(?:\\.[^"\\]*)*)"(\s*\+\s*"([^"\\]*(?:\\.[^"\\]*)*)")+("([^"\\]*(?:\\.[^"\\]*)*)"|$)/g,
      (match, p1, _, p2, p3, p4) => `"${p1}${p2}${p3}${p4}"`
    );

    // Add missing quotes around keys, replace single quotes with double quotes, replace special quote characters and white space characters
    jsonString = jsonString.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
    jsonString = jsonString.replace(/'/g, '"');
    jsonString = jsonString.replace(/[“”]/g, '"');
    jsonString = jsonString.replace(/\s/g, " ");

    // Add missing commas, strip trailing commas, and add double-quoted property names
    jsonString = jsonString.replace(/([,{\[}\]])\s*(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '$1"$3": ');
    jsonString = jsonString.replace(/,(\s*[}\]])/g, "$1");

    // Add missing closing brackets
    const brackets = [];
    jsonString.split("").forEach(char => {
      if (char === "{" || char === "[") {
        brackets.push(char as never);
      } else if (char === "}" || char === "]") {
        if (
          brackets.length > 0 &&
          ((char === "}" && brackets[brackets.length - 1] === "{") ||
            (char === "]" && brackets[brackets.length - 1] === "["))
        ) {
          brackets.pop();
        } else {
          jsonString = jsonString.slice(0, -1);
        }
      }
    });
    while (brackets.length > 0) {
      const lastBracket = brackets.pop();
      jsonString += lastBracket === "{" ? "}" : "]";
    }

    // Parse and return the fixed JSON
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch (error) {
    toast.error("Unable to fix this JSON!");
    return jsonString;
  }
}
