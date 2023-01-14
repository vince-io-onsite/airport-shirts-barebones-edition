export function toCamelCase(stringWithSpaces: string): string {
  return stringWithSpaces
    .trim()
    .replace(
      /^\w|[A-Z]|\b\w/g,
      (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase())
    .replace(/\s+/g, "");
}

export function toLowerCase(stringWithCamelCase: string): string {
  return stringWithCamelCase
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .trim();
}