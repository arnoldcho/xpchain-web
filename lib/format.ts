type DateTimeOptions = {
  locale?: string;
  timeZone?: string;
};

export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatSeconds(value: number, unitLabel = '초'): string {
  return `${value.toFixed(1)}${unitLabel}`;
}

export function formatDateTime(value: string, options: DateTimeOptions = {}): string {
  const { locale = 'ko-KR', timeZone = 'Asia/Seoul' } = options;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone
  }).format(date);
}

export function formatPercent(value: number | null, locale = 'en-US'): string {
  if (value === null || !Number.isFinite(value)) {
    return '-';
  }
  return `${new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value * 100)}%`;
}
