export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "_" : "") + $.toLowerCase());

export const snakeToCamelCase = (str: string) => str.replace(/(_[a-z])/g, $ => $.toUpperCase().replace("_", ""));
