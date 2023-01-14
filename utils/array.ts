export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}