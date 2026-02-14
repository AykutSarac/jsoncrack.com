/*
	JSON-to-Go
	by Matt Holt

	https://github.com/mholt/json-to-go

	A simple utility to translate JSON into a Go type definition.
*/

function jsonToGo(json, typename, flatten = true, example = false, allOmitempty = false) {
  let data;
  let scope;
  let go = "";
  let tabs = 0;

  const seen = {};
  const stack = [];
  let accumulator = "";
  const innerTabs = 0;
  let parent = "";

  try {
    data = JSON.parse(json.replace(/(:\s*\[?\s*-?\d*)\.0/g, "$1.1")); // hack that forces floats to stay as floats
    scope = data;
  } catch (e) {
    return {
      go: "",
      error: e.message,
    };
  }

  typename = format(typename || "Root");
  append(`type ${typename} `);

  parseScope(scope);

  return {
    go: flatten ? (go += accumulator) : go,
  };

  function parseScope(scope, depth = 0) {
    if (typeof scope === "object" && scope !== null) {
      if (Array.isArray(scope)) {
        let sliceType;
        const scopeLength = scope.length;

        for (let i = 0; i < scopeLength; i++) {
          const thisType = goType(scope[i]);
          if (!sliceType) sliceType = thisType;
          else if (sliceType != thisType) {
            sliceType = mostSpecificPossibleGoType(thisType, sliceType);
            if (sliceType == "any") break;
          }
        }

        const slice = flatten && ["struct", "slice"].includes(sliceType) ? `[]${parent}` : "[]";

        if (flatten && depth >= 2) appender(slice);
        else append(slice);
        if (sliceType == "struct") {
          const allFields = {};

          // for each field counts how many times appears
          for (let i = 0; i < scopeLength; i++) {
            const keys = Object.keys(scope[i]);
            for (const k in keys) {
              let keyname = keys[k];
              if (!(keyname in allFields)) {
                allFields[keyname] = {
                  value: scope[i][keyname],
                  count: 0,
                };
              } else {
                const existingValue = allFields[keyname].value;
                const currentValue = scope[i][keyname];

                if (compareObjects(existingValue, currentValue)) {
                  const comparisonResult = compareObjectKeys(
                    Object.keys(currentValue),
                    Object.keys(existingValue)
                  );
                  if (!comparisonResult) {
                    keyname = `${keyname}_${uuidv4()}`;
                    allFields[keyname] = {
                      value: currentValue,
                      count: 0,
                    };
                  }
                }
              }
              allFields[keyname].count++;
            }
          }

          // create a common struct with all fields found in the current array
          // omitempty dict indicates if a field is optional
          const keys = Object.keys(allFields),
            struct = {},
            omitempty = {};
          for (const k in keys) {
            const keyname = keys[k],
              elem = allFields[keyname];

            struct[keyname] = elem.value;
            omitempty[keyname] = elem.count != scopeLength;
          }
          parseStruct(depth + 1, innerTabs, struct, omitempty); // finally parse the struct !!
        } else if (sliceType == "slice") {
          parseScope(scope[0], depth);
        } else {
          if (flatten && depth >= 2) {
            appender(sliceType || "any");
          } else {
            append(sliceType || "any");
          }
        }
      } else {
        if (flatten) {
          if (depth >= 2) {
            appender(parent);
          } else {
            append(parent);
          }
        }
        parseStruct(depth + 1, innerTabs, scope);
      }
    } else {
      if (flatten && depth >= 2) {
        appender(goType(scope));
      } else {
        append(goType(scope));
      }
    }
  }

  function parseStruct(depth, innerTabs, scope, omitempty) {
    if (flatten) {
      stack.push(depth >= 2 ? "\n" : "");
    }

    const seenTypeNames = [];

    if (flatten && depth >= 2) {
      const parentType = `type ${parent}`;
      const scopeKeys = formatScopeKeys(Object.keys(scope));

      // this can only handle two duplicate items
      // future improvement will handle the case where there could
      // three or more duplicate keys with different values
      if (parent in seen && compareObjectKeys(scopeKeys, seen[parent])) {
        stack.pop();
        return;
      }
      seen[parent] = scopeKeys;

      appender(`${parentType} struct {\n`);
      ++innerTabs;
      const keys = Object.keys(scope);
      for (const i in keys) {
        const keyname = getOriginalName(keys[i]);
        indenter(innerTabs);
        const typename = uniqueTypeName(format(keyname), seenTypeNames);
        seenTypeNames.push(typename);

        appender(typename + " ");
        parent = typename;
        parseScope(scope[keys[i]], depth);
        appender(' `json:"' + keyname);
        if (allOmitempty || (omitempty && omitempty[keys[i]] === true)) {
          appender(",omitempty");
        }
        appender('"`\n');
      }
      indenter(--innerTabs);
      appender("}");
    } else {
      append("struct {\n");
      ++tabs;
      const keys = Object.keys(scope);
      for (const i in keys) {
        const keyname = getOriginalName(keys[i]);
        indent(tabs);
        const typename = uniqueTypeName(format(keyname), seenTypeNames);
        seenTypeNames.push(typename);
        append(typename + " ");
        parent = typename;
        parseScope(scope[keys[i]], depth);
        append(' `json:"' + keyname);
        if (allOmitempty || (omitempty && omitempty[keys[i]] === true)) {
          append(",omitempty");
        }
        if (example && scope[keys[i]] !== "" && typeof scope[keys[i]] !== "object") {
          append('" example:"' + scope[keys[i]]);
        }
        append('"`\n');
      }
      indent(--tabs);
      append("}");
    }
    if (flatten) accumulator += stack.pop();
  }

  function indent(tabs) {
    for (let i = 0; i < tabs; i++) go += "\t";
  }

  function append(str) {
    go += str;
  }

  function indenter(tabs) {
    for (let i = 0; i < tabs; i++) stack[stack.length - 1] += "\t";
  }

  function appender(str) {
    stack[stack.length - 1] += str;
  }

  // Generate a unique name to avoid duplicate struct field names.
  // This function appends a number at the end of the field name.
  function uniqueTypeName(name, seen) {
    if (seen.indexOf(name) === -1) {
      return name;
    }

    let i = 0;
    while (true) {
      const newName = name + i.toString();
      if (seen.indexOf(newName) === -1) {
        return newName;
      }

      i++;
    }
  }

  // Sanitizes and formats a string to make an appropriate identifier in Go
  function format(str) {
    str = formatNumber(str);

    const sanitized = toProperCase(str).replace(/[^a-z0-9]/gi, "");
    if (!sanitized) {
      return "NAMING_FAILED";
    }

    // After sanitizing the remaining characters can start with a number.
    // Run the sanitized string again trough formatNumber to make sure the identifier is Num[0-9] or Zero_... instead of 1.
    return formatNumber(sanitized);
  }

  // Adds a prefix to a number to make an appropriate identifier in Go
  function formatNumber(str) {
    if (!str) return "";
    else if (str.match(/^\d+$/)) str = "Num" + str;
    else if (str.charAt(0).match(/\d/)) {
      const numbers = {
        0: "Zero_",
        1: "One_",
        2: "Two_",
        3: "Three_",
        4: "Four_",
        5: "Five_",
        6: "Six_",
        7: "Seven_",
        8: "Eight_",
        9: "Nine_",
      };
      str = numbers[str.charAt(0)] + str.substr(1);
    }

    return str;
  }

  // Determines the most appropriate Go type
  function goType(val) {
    if (val === null) return "any";

    switch (typeof val) {
      case "string":
        if (/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(\+\d\d:\d\d|Z)/.test(val)) return "time.Time";
        else return "string";
      case "number":
        if (val % 1 === 0) {
          if (val > -2147483648 && val < 2147483647) return "int";
          else return "int64";
        } else return "float64";
      case "boolean":
        return "bool";
      case "object":
        if (Array.isArray(val)) return "slice";
        return "struct";
      default:
        return "any";
    }
  }

  // Given two types, returns the more specific of the two
  function mostSpecificPossibleGoType(typ1, typ2) {
    if (typ1.substr(0, 5) == "float" && typ2.substr(0, 3) == "int") return typ1;
    else if (typ1.substr(0, 3) == "int" && typ2.substr(0, 5) == "float") return typ2;
    else return "any";
  }

  // Proper cases a string according to Go conventions
  function toProperCase(str) {
    // ensure that the SCREAMING_SNAKE_CASE is converted to snake_case
    if (str.match(/^[_A-Z0-9]+$/)) {
      str = str.toLowerCase();
    }

    // https://github.com/golang/lint/blob/5614ed5bae6fb75893070bdc0996a68765fdd275/lint.go#L771-L810
    const commonInitialisms = [
      "ACL",
      "API",
      "ASCII",
      "CPU",
      "CSS",
      "DNS",
      "EOF",
      "GUID",
      "HTML",
      "HTTP",
      "HTTPS",
      "ID",
      "IP",
      "JSON",
      "LHS",
      "QPS",
      "RAM",
      "RHS",
      "RPC",
      "SLA",
      "SMTP",
      "SQL",
      "SSH",
      "TCP",
      "TLS",
      "TTL",
      "UDP",
      "UI",
      "UID",
      "UUID",
      "URI",
      "URL",
      "UTF8",
      "VM",
      "XML",
      "XMPP",
      "XSRF",
      "XSS",
    ];

    return str
      .replace(/(^|[^a-zA-Z])([a-z]+)/g, function (unused, sep, frag) {
        if (commonInitialisms.indexOf(frag.toUpperCase()) >= 0) return sep + frag.toUpperCase();
        else return sep + frag[0].toUpperCase() + frag.substr(1).toLowerCase();
      })
      .replace(/([A-Z])([a-z]+)/g, function (unused, sep, frag) {
        if (commonInitialisms.indexOf(sep + frag.toUpperCase()) >= 0)
          return (sep + frag).toUpperCase();
        else return sep + frag;
      });
  }

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getOriginalName(unique) {
    const reLiteralUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const uuidLength = 36;

    if (unique.length >= uuidLength) {
      const tail = unique.substr(-uuidLength);
      if (reLiteralUUID.test(tail)) {
        return unique.slice(0, -1 * (uuidLength + 1));
      }
    }
    return unique;
  }

  function compareObjects(objectA, objectB) {
    const object = "[object Object]";
    return (
      Object.prototype.toString.call(objectA) === object &&
      Object.prototype.toString.call(objectB) === object
    );
  }

  function compareObjectKeys(itemAKeys, itemBKeys) {
    const lengthA = itemAKeys.length;
    const lengthB = itemBKeys.length;

    // nothing to compare, probably identical
    if (lengthA == 0 && lengthB == 0) return true;

    // duh
    if (lengthA != lengthB) return false;

    for (const item of itemAKeys) {
      if (!itemBKeys.includes(item)) return false;
    }
    return true;
  }

  function formatScopeKeys(keys) {
    for (const i in keys) {
      keys[i] = format(keys[i]);
    }
    return keys;
  }
}

if (typeof module != "undefined") {
  module.exports = jsonToGo;
}
