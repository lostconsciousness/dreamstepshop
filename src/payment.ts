import type { PaymentInit } from './types';

export type PaymentProvider = 'cryptocloud' | 'paymento';

export const redirectToPayment = (result: PaymentInit): void => {
  if (result.payment_url) {
    window.location.assign(result.payment_url);
    return;
  }
  throw new Error(result.message || 'Payment link is not available.');
};
