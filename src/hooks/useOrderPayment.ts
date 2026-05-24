import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import type { Order } from '../types';

export const isOrderPaid = (status: string): boolean => /paid|completed|success/i.test(status);

export const useOrderPayment = () => {
  const mutation = useMutation({
    mutationFn: async (order: Order) => {
      const result = await api.payOrder(order.id);
      if (result.payment_url) {
        window.location.assign(result.payment_url);
        return result;
      }
      throw new Error(result.message || 'Payment link is not available.');
    },
  });

  return {
    pay: mutation.mutate,
    isPaying: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
};
