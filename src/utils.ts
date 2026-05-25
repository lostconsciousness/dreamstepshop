const currencyToISO = (currency: string): string => {
  switch (currency.toUpperCase()) {
    case 'USD':
      return 'USD';
    case 'EUR':
      return 'EUR';
    case 'UAH':
    case 'ГРН':
    case '':
      return 'UAH';
    default:
      return currency.toUpperCase();
  }
};

export const formatPrice = (value: string | number, currency: string): string => {
  const numeric = typeof value === 'number' ? value : Number.parseFloat(value);
  if (!Number.isFinite(numeric)) {
    return '—';
  }

  const iso = currencyToISO(currency);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: iso,
      maximumFractionDigits: 2,
    }).format(numeric);
  } catch {
    return `${numeric.toFixed(2)} ${iso}`;
  }
};

export const toNumber = (value: string | number): number => {
  if (typeof value === 'number') {
    return value;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const extractApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected error. Please try again.';
};
