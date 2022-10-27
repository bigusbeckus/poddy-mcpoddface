export function isNumeric(text: string) {
  return /^\d+$/.test(text);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function clampInt(value: number, min: number, max: number) {
  return Math.floor(clamp(value, min, max));
}
