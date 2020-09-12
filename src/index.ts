import { toString } from "./to-string";
import { assertTypes } from "./assert-types";

export interface TypeOption {
  type: string | string[];
  enum?: unknown[];
  additional?: unknown[];
}

export const assertType = (
  variable: unknown,
  type: string[] | string | TypeOption,
  variableName = ""
): boolean => {
  if (typeof type === "string" || Array.isArray(type))
    return assertTypes(variable, type, variableName);

  if (typeof type === "object") {
    if (type.enum) {
      if (type.enum.includes(variable)) return true;

      console.error(
        `${variableName} 应为 ${type.enum.join(
          "、"
        )} 中之一，但此处为 ${toString(variable)}`
      );

      return false;
    }

    if (type.additional && type.additional.some((value) => variable === value))
      return true;

    return assertTypes(variable, type.type, variableName);
  }

  console.error(`未知类型配置 ${toString(type)}`);

  return false;
};

export const checkKeys = (
  obj: unknown,
  config: Record<string, string[] | string | TypeOption>,
  objName = ""
): boolean => {
  if (typeof obj === "object" && obj !== null) {
    const configKeys = Object.keys(config);

    for (const key in obj) {
      if (config[key]) {
        if (
          assertType(
            (obj as Record<string | number | symbol, unknown>)[key],
            config[key],
            `${objName ? `${objName}.` : ""}${key}`
          )
        ) {
          configKeys.splice(configKeys.indexOf(key), 1);

          continue;
        }

        return false;
      }

      console.error(`${objName} 不应存在 ${key}`);

      return false;
    }

    const unfindKeys = configKeys.filter((key) => {
      const type = config[key];

      return typeof type === "string"
        ? type !== "undefined"
        : Array.isArray(type)
        ? !type.some((typeItem) => typeItem === "undefined")
        : typeof type.type === "string"
        ? type.type !== "undefined"
        : !type.type.some((typeItem) => typeItem === "undefined");
    });

    if (unfindKeys.length === 0) return true;

    console.error(`${objName} 未找到 ${unfindKeys.toString()}`);

    return false;
  }

  console.error(`${objName} 应为 object，但其类型为 ${typeof obj}`);

  return false;
};
