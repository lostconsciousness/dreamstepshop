const ORDER_EMAIL_STORAGE_KEY = 'orderEmail';

export const setStoredOrderEmail = (email: string): void => {
  const normalized = email.trim();
  if (!normalized) {
    return;
  }
  try {
    localStorage.setItem(ORDER_EMAIL_STORAGE_KEY, normalized);
  } catch {
    // ignore
  }
};

export const getStoredOrderEmail = (): string | null => {
  try {
    const value = localStorage.getItem(ORDER_EMAIL_STORAGE_KEY);
    return value?.trim() || null;
  } catch {
    return null;
  }
};

export const clearStoredOrderEmail = (): void => {
  try {
    localStorage.removeItem(ORDER_EMAIL_STORAGE_KEY);
  } catch {
    // ignore
  }
};

/** Prefer order email from API, then value saved at checkout / lookup. */
export const resolveOrderEmail = (orderEmail?: string | null): string | null => {
  const fromOrder = orderEmail?.trim();
  if (fromOrder) {
    return fromOrder;
  }
  return getStoredOrderEmail();
};
