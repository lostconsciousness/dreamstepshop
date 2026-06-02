import { getPendingOrderId } from './pendingOrder';

/** URLs configured in the CryptoCloud project dashboard. */
export const CRYPTO_CLOUD_URLS = {
  success: 'https://dreamstepshop.general2286.workers.dev/payment-success',
  failed: 'https://dreamstepshop.general2286.workers.dev/payment-failed',
  callback: 'https://dreamstepshop.general2286.workers.dev/callback',
} as const;

export const parseOrderIdFromPaymentReturn = (params: URLSearchParams): number | null => {
  const raw =
    params.get('order_id') ??
    params.get('orderId') ??
    params.get('OrderId') ??
    params.get('order');
  if (raw) {
    const id = Number(raw);
    if (Number.isFinite(id) && id > 0) {
      return id;
    }
  }
  return getPendingOrderId();
};
