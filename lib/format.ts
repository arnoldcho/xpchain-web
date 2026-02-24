export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatSeconds(value: number): string {
  return `${value.toFixed(1)}초`;
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export function formatPercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return '-';
  }
  return `${(value * 100).toFixed(2)}%`;
}
