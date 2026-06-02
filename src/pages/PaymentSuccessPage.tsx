import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, setStoredCartToken } from '../api';
import { OrderEmailPrompt } from '../components/OrderEmailPrompt';
import { StateBlock } from '../components/State';
import { parseOrderIdFromPaymentReturn } from '../cryptocloudUrls';
import { isOrderPaid } from '../hooks/useOrderPayment';
import { useI18n } from '../i18n';
import { clearPendingOrderId } from '../pendingOrder';
import { rememberOrderAccess } from '../orderAccess';
import { getStoredOrderEmail, setStoredOrderEmail } from '../orderEmail';

const POLL_MS = 2000;
const POLL_TIMEOUT_MS = 120_000;

export const PaymentSuccessPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const orderId = parseOrderIdFromPaymentReturn(searchParams);
  const [email, setEmail] = useState<string | null>(() => getStoredOrderEmail());
  const [pollTimedOut, setPollTimedOut] = useState(false);

  useEffect(() => {
    setStoredCartToken(null);
    queryClient.removeQueries({ queryKey: ['cart'] });
  }, [queryClient]);

  useEffect(() => {
    if (!orderId) {
      return;
    }
    rememberOrderAccess(orderId);
    const id = window.setTimeout(() => setPollTimedOut(true), POLL_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [orderId]);

  const orderQuery = useQuery({
    queryKey: ['order', orderId, email, 'payment-return'],
    queryFn: () => api.getOrder(orderId!, email!),
    enabled: Boolean(orderId) && Boolean(email),
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

  const paid = orderQuery.data ? isOrderPaid(orderQuery.data.status) : false;

  useEffect(() => {
    if (orderQuery.data?.email) {
      setStoredOrderEmail(orderQuery.data.email);
    }
  }, [orderQuery.data?.email]);

  useEffect(() => {
    if (paid && orderId) {
      clearPendingOrderId();
      navigate(`/orders/${orderId}`, { replace: true });
    }
  }, [paid, orderId, navigate]);

  if (!orderId) {
    return (
      <StateBlock
        emoji="🤔"
        title={t.paymentSuccessTitle}
        message={t.paymentReturnNoOrderId}
        actions={
          <Link to="/orders/track" className="btn btn-primary">
            {t.trackOrder}
          </Link>
        }
      />
    );
  }

  if (!email) {
    return (
      <StateBlock
        emoji="📧"
        title={t.orderEmailRequiredTitle}
        message={t.paymentEmailRequiredMessage}
        actions={
          <div className="checkout-card track-order-card" style={{ width: '100%' }}>
            <OrderEmailPrompt onSubmit={setEmail} />
          </div>
        }
      />
    );
  }

  const polling = !paid && !pollTimedOut;

  if (paid) {
    return <StateBlock title={t.loadingOrder} />;
  }

  return (
    <StateBlock
      emoji={polling ? '⏳' : '✅'}
      title={polling ? t.paymentConfirmingTitle : t.paymentSuccessTitle}
      message={
        polling
          ? t.paymentConfirmingMessage(orderId)
          : pollTimedOut
            ? t.paymentConfirmingTimeout
            : t.paymentReturnSuccess
      }
    />
  );
};
