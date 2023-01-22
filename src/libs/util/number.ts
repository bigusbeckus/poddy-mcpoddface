export function isNumeric(text: string) {
  return /^\d+$/.test(text);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function clampInt(value: number, min: number, max: number) {
  return Math.floor(clamp(value, min, max));
}

type RoundMethod = "up" | "down";
export function randomFromRange(min: number, max: number, round?: RoundMethod) {
  const number = Math.random() * (max - min + 1) + min;
  if (round) {
    return round === "up" ? Math.ceil(number) : Math.floor(number);
  }
  return number;
}
