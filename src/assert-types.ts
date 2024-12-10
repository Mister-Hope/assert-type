import { assertType } from "./assert-type.js";
import { toString } from "./to-string.js";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const assertTypes = <T = unknown>(
  variable: T,
  type: string[] | string,
  variableName = "",
): boolean => {
  if (typeof type === "string") {
    if (assertType(variable, type)) return true;

    console.error(
      `${variableName} 应为 ${type}，但此处为 ${toString(variable)}`,
    );

    return false;
  }

  if (Array.isArray(type)) {
    if (type.some((typeItem) => assertType(variable, typeItem))) return true;

    console.error(
      `${variableName} 应为 ${type.toString()}，但此处为 ${toString(variable)}`,
    );

    return false;
  }

  console.error(`未知类型配置 ${toString(type)}`);

  return false;
};
