import { useMutation } from '@tanstack/react-query';
import { createCryptoCloudInvoice, isCryptoCloudEnabled } from '../cryptocloud';
import type { Order } from '../types';
import { toNumber } from '../utils';

export const isOrderPaid = (status: string): boolean => /paid|completed|success/i.test(status);

export const useCryptoCloudPayment = () => {
  const mutation = useMutation({
    mutationFn: async (order: Order) => {
      const amount = toNumber(order.total);
      const link = await createCryptoCloudInvoice({
        amount,
        currency: order.currency,
        orderId: String(order.id),
        email: order.email,
      });
      window.location.assign(link);
      return link;
    },
  });

  return {
    isEnabled: isCryptoCloudEnabled(),
    pay: mutation.mutate,
    isPaying: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
};
