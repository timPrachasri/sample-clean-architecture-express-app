export function toUnixSecond(date: Date): number {
  return Math.floor(Math.round(date.getTime() / 1000))
}
