import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { api, setStoredCartToken } from '../api';
import { Icon } from '../components/Icon';
import { StateBlock } from '../components/State';
import { parseOrderIdFromPaymentReturn } from '../cryptocloudUrls';
import { isOrderPaid } from '../hooks/useOrderPayment';
import { useI18n } from '../i18n';
import { clearPendingOrderId } from '../pendingOrder';

const POLL_MS = 2000;
const POLL_TIMEOUT_MS = 120_000;

export const PaymentSuccessPage = () => {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const orderId = parseOrderIdFromPaymentReturn(searchParams);
  const [pollTimedOut, setPollTimedOut] = useState(false);

  useEffect(() => {
    setStoredCartToken(null);
    queryClient.removeQueries({ queryKey: ['cart'] });
  }, [queryClient]);

  useEffect(() => {
    if (!orderId) {
      return;
    }
    const id = window.setTimeout(() => setPollTimedOut(true), POLL_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [orderId]);

  const orderQuery = useQuery({
    queryKey: ['order', orderId, 'payment-return'],
    queryFn: () => api.getOrder(orderId!),
    enabled: Boolean(orderId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status) {
        return POLL_MS;
      }
      if (isOrderPaid(status) || status === 'cancelled' || pollTimedOut) {
        return false;
      }
      return POLL_MS;
    },
  });

  useEffect(() => {
    if (orderQuery.data && isOrderPaid(orderQuery.data.status)) {
      clearPendingOrderId();
    }
  }, [orderQuery.data]);

  const paid = orderQuery.data ? isOrderPaid(orderQuery.data.status) : false;
  const polling = Boolean(orderId) && !paid && !pollTimedOut && (orderQuery.isFetching || orderQuery.isPending);

  return (
    <StateBlock
      emoji={paid ? '✅' : polling ? '⏳' : '✅'}
      title={paid ? t.paymentSuccessTitle : polling ? t.paymentConfirmingTitle : t.paymentSuccessTitle}
      message={
        paid
          ? t.paymentReturnSuccess
          : polling
            ? t.paymentConfirmingMessage(orderId!)
            : pollTimedOut
              ? t.paymentConfirmingTimeout
              : t.paymentReturnSuccess
      }
      actions={
        <>
          {orderId ? (
            <Link to={`/orders/${orderId}`} className="btn btn-primary">
              <Icon name="checkmark-circle" />
              <span>{t.viewOrder}</span>
            </Link>
          ) : null}
          <Link to="/" className="btn btn-ghost">
            <Icon name="arrow-left" />
            <span>{t.toCatalog}</span>
          </Link>
        </>
      }
    />
  );
};
