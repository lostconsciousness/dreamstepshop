const PENDING_ORDER_STORAGE_KEY = 'pending_order_id';

export const setPendingOrderId = (orderId: number): void => {
  try {
    localStorage.setItem(PENDING_ORDER_STORAGE_KEY, String(orderId));
  } catch {
    // ignore
  }
};

export const getPendingOrderId = (): number | null => {
  try {
    const raw = localStorage.getItem(PENDING_ORDER_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const id = Number(raw);
    return Number.isFinite(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
};

export const clearPendingOrderId = (): void => {
  try {
    localStorage.removeItem(PENDING_ORDER_STORAGE_KEY);
  } catch {
    // ignore
  }
};
