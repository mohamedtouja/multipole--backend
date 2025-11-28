import ms, { StringValue } from 'ms';

const DEFAULT_FALLBACK: StringValue = '60s';

export function durationToSeconds(
  value: string | undefined,
  fallback: StringValue = DEFAULT_FALLBACK,
): number {
  if (!value) {
    return Math.floor(ms(fallback) / 1000);
  }

  const numeric = Number(value);
  if (!Number.isNaN(numeric) && numeric > 0) {
    return Math.floor(numeric);
  }

  const parsed = ms(value as StringValue);
  if (typeof parsed !== 'number') {
    return Math.floor(ms(fallback) / 1000);
  }

  return Math.floor(parsed / 1000);
}

export function durationToMilliseconds(
  value: string | undefined,
  fallback: StringValue = DEFAULT_FALLBACK,
): number {
  return durationToSeconds(value, fallback) * 1000;
}
