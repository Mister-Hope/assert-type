/* eslint-disable @typescript-eslint/restrict-template-expressions */

const simpleAssetType = (variable: unknown, type: string): boolean => {
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

    return variable.every((item) => simpleAssetType(item, itemType));
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
            `应为 ${type}，但值 ${
              (variable as Record<string | number | symbol, unknown>)[key]
            } 为 ${typeof (variable as Record<
              string | number | symbol,
              unknown
            >)[key]}`
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

const assertTypes = (
  variable: unknown,
  type: string[] | string,
  variableName = ""
): boolean => {
  if (typeof type === "string") {
    if (simpleAssetType(variable, type)) return true;

    console.error(
      `${variableName} 应为 ${type}，但此处为 ${
        Array.isArray(variable)
          ? `[${variable.toString()}]`
          : typeof variable === "object" && variable !== null
          ? JSON.stringify(variable)
          : variable
      }`
    );

    return false;
  }

  if (Array.isArray(type)) {
    if (type.some((typeItem) => simpleAssetType(variable, typeItem)))
      return true;

    console.error(
      `${variableName} 应为 ${type.toString()}，但此处为 ${
        Array.isArray(variable)
          ? `[${variable.toString()}]`
          : typeof variable === "object" && variable !== null
          ? variable.toString()
          : variable
      }`
    );

    return false;
  }

  console.error(`未知类型配置 ${type}`);

  return false;
};

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
        )} 中之一，但此处为 ${variable}`
      );

      return false;
    }

    if (type.additional && type.additional.some((value) => variable === value))
      return true;

    return assertTypes(variable, type.type, variableName);
  }

  console.error(`未知类型配置 ${type}`);

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
        ? type.some((typeItem) => typeItem === "undefined")
        : true;
    });

    if (unfindKeys.length === 0) return true;

    console.error(`${objName} 未找到 ${unfindKeys.toString()}`);

    return false;
  }

  console.error(`${objName} 应为 object，但其值为 ${obj}`);

  return false;
};
