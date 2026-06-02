import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { redirectToPayment, type PaymentProvider } from '../payment';
import { setPendingOrderId } from '../pendingOrder';
import type { Order } from '../types';

export const isOrderPaid = (status: string): boolean => /paid|completed|success/i.test(status);

type PayInput = {
  order: Order;
  provider: PaymentProvider;
};

export const useOrderPayment = () => {
  const mutation = useMutation({
    mutationFn: async ({ order, provider }: PayInput) => {
      setPendingOrderId(order.id);
      const result =
        provider === 'paymento'
          ? await api.payOrderPaymento(order.id)
          : await api.payOrder(order.id);
      redirectToPayment(result);
      return result;
    },
  });

  const pay = (order: Order, provider: PaymentProvider) => {
    mutation.mutate({ order, provider });
  };

  return {
    pay,
    isPaying: mutation.isPending,
    payingProvider: mutation.isPending ? mutation.variables?.provider ?? null : null,
    error: mutation.error,
    reset: mutation.reset,
  };
};
