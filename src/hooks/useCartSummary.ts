import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, getStoredCartToken } from '../api';
import { useCurrency } from '../currency';

export const useCartSummary = () => {
  const { currency } = useCurrency();
  const [hasToken, setHasToken] = useState<boolean>(() => Boolean(getStoredCartToken()));

  useEffect(() => {
    const update = () => setHasToken(Boolean(getStoredCartToken()));
    window.addEventListener('cart-token-changed', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('cart-token-changed', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const cartQuery = useQuery({
    queryKey: ['cart', currency],
    queryFn: api.getCart,
    enabled: hasToken,
  });

  const lines = cartQuery.data?.lines ?? [];
  const totalItems = lines.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);

  return {
    hasToken,
    cart: cartQuery.data ?? null,
    totalItems,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
  };
};
