export const toString = (variable: unknown): string =>
  Array.isArray(variable)
    ? `[${variable.toString()}]`
    : typeof variable === "object" && variable !== null
    ? JSON.stringify(variable)
    : typeof variable === "symbol"
    ? variable.description || ""
    : variable === null
    ? "null"
    : typeof variable === "undefined"
    ? "undefined"
    : (variable as string | number | boolean).toString();
