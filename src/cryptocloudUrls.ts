/** URLs configured in the CryptoCloud project dashboard. */
export const CRYPTO_CLOUD_URLS = {
  success: 'https://dreamstepshop.general2286.workers.dev/payment-success',
  failed: 'https://dreamstepshop.general2286.workers.dev/payment-failed',
  callback: 'https://dreamstepshop.general2286.workers.dev/callback',
} as const;

export const parseOrderIdFromPaymentReturn = (params: URLSearchParams): number | null => {
  const raw = params.get('order_id') ?? params.get('orderId') ?? params.get('order');
  if (!raw) {
    return null;
  }
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
};
