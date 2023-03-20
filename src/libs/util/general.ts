// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isIterable(obj: any) {
  return !(obj === null || obj === undefined) && typeof obj[Symbol.iterator] === "function";
}
