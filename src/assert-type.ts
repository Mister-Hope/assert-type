import { toString } from "./to-string.js";

export const assertType = <T = unknown>(variable: T, type: string): boolean => {
  if (type === "array") return Array.isArray(variable);
  if (type === "null") return variable === null;
  if (["number", "string", "boolean", "undefined"].includes(type))
    return typeof variable === type;
  if (type === "object")
    return (
      !Array.isArray(variable) &&
      variable !== null &&
      typeof variable === "object"
    );

  const arrayMatchResult = /(.*)\[\]/u.exec(type);

  if (arrayMatchResult) {
    if (!Array.isArray(variable)) return false;
    const itemType = arrayMatchResult[1];

    return variable.every((item) => assertType(item, itemType));
  }

  const objectMatchResult = /Record<(.*), ?(.*)>/u.exec(type);

  if (objectMatchResult) {
    if (
      typeof variable === "object" &&
      !Array.isArray(variable) &&
      variable !== null
    ) {
      const keyType = objectMatchResult[1];
      const contentType = objectMatchResult[2];

      for (const key in variable) {
        if (typeof key !== keyType) {
          console.error(`应为 ${type}，但键 ${key} 为 ${typeof key}`);
          return false;
        }

        if (
          typeof (variable as Record<string | number | symbol, unknown>)[
            key
          ] !== contentType
        ) {
          console.error(
            `应为 ${type}，但值 ${toString(
              (variable as Record<string | number | symbol, unknown>)[key]
            )} 为 ${typeof (
              variable as Record<string | number | symbol, unknown>
            )[key]}`
          );

          return false;
        }
      }

      return true;
    }

    return false;
  }

  console.warn(`未知类型 ${type}`);

  return false;
};
