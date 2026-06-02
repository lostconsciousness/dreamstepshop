const RECENT_ORDERS_KEY = 'recent_order_ids';

export const rememberOrderAccess = (orderId: number): void => {
  try {
    const ids = getRecentOrderIds();
    const next = [orderId, ...ids.filter((id) => id !== orderId)].slice(0, 30);
    localStorage.setItem(RECENT_ORDERS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
};

export const getRecentOrderIds = (): number[] => {
  try {
    const raw = localStorage.getItem(RECENT_ORDERS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((value) => Number(value))
      .filter((id) => Number.isFinite(id) && id > 0);
  } catch {
    return [];
  }
};

export const hasOrderAccess = (orderId: number): boolean => getRecentOrderIds().includes(orderId);
