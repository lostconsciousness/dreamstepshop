import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { OrderEmailPrompt } from '../components/OrderEmailPrompt';
import { useCurrency } from '../currency';
import { Icon } from '../components/Icon';
import { OrderSummary } from '../components/OrderSummary';
import { StateBlock } from '../components/State';
import { isOrderPaid } from '../hooks/useOrderPayment';
import { useI18n } from '../i18n';
import { rememberOrderAccess } from '../orderAccess';
import { getStoredOrderEmail, setStoredOrderEmail } from '../orderEmail';
import { getOrderStatusLabel, isOrderCancelled } from '../orderStatus';
import { extractApiError } from '../utils';

const POLL_MS = 3000;

export const OrderPage = () => {
  const { t } = useI18n();
  const { currency } = useCurrency();
  const params = useParams();
  const orderId = Number(params.id);
  const [email, setEmail] = useState<string | null>(() => getStoredOrderEmail());

  const orderQuery = useQuery({
    queryKey: ['order', orderId, email, currency],
    queryFn: () => api.getOrder(orderId, email!),
    enabled: Number.isFinite(orderId) && Boolean(email),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || isOrderPaid(status) || isOrderCancelled(status)) {
        return false;
      }
      return POLL_MS;
    },
  });

  useEffect(() => {
    if (Number.isFinite(orderId)) {
      rememberOrderAccess(orderId);
    }
  }, [orderId]);

  useEffect(() => {
    const orderEmail = orderQuery.data?.email;
    if (orderEmail) {
      setStoredOrderEmail(orderEmail);
      if (!email || email !== orderEmail) {
        setEmail(orderEmail);
      }
    }
  }, [orderQuery.data?.email, email]);

  if (!Number.isFinite(orderId)) {
    return <StateBlock emoji="🤔" title={t.invalidOrderId} />;
  }

  if (!email) {
    return (
      <section className="content">
        <div className="section-header">
          <span className="eyebrow">{t.order}</span>
          <h1>{t.orderEmailRequiredTitle}</h1>
          <p>{t.orderEmailRequiredSubtitle}</p>
        </div>
        <div className="checkout-card track-order-card">
          <OrderEmailPrompt onSubmit={setEmail} />
          <Link to="/orders/track" className="btn btn-ghost btn-block">
            {t.trackOrder}
          </Link>
        </div>
      </section>
    );
  }

  if (orderQuery.isPending) {
    return <StateBlock title={t.loadingOrder} />;
  }

  if (orderQuery.isError) {
    return (
      <StateBlock
        emoji="⚠️"
        title={t.cannotLoadOrder}
        message={extractApiError(orderQuery.error)}
        actions={
          <>
            <Link to="/orders/track" className="btn btn-primary">
              {t.trackOrder}
            </Link>
            <Link to="/" className="btn btn-ghost">
              {t.toCatalog}
            </Link>
          </>
        }
      />
    );
  }

  const order = orderQuery.data;
  const paid = isOrderPaid(order.status);
  const pending = /pending/i.test(order.status);
  const statusLabel = getOrderStatusLabel(order.status, t);

  return (
    <section className="content">
      <div className="section-header">
        <span className="eyebrow">{t.order} #{order.id}</span>
        <h1>{paid ? t.orderConfirmationTitle : t.orderStatusTitle(order.id)}</h1>
        <span
          className={`status-pill${paid ? ' status-pill--paid' : pending ? ' status-pill--pending' : ''}`}
        >
          {statusLabel}
        </span>
      </div>

      <article className="checkout-card">
        {paid ? (
          <p className="toast success order-confirmation-banner">{t.orderConfirmationMessage}</p>
        ) : pending ? (
          <p className="toast order-pending-banner">{t.orderPendingPaymentMessage}</p>
        ) : null}

        <OrderSummary order={order} />

        <div className="add-row">
          {pending ? (
            <Link to={`/orders/${order.id}/pay`} className="btn btn-primary">
              <Icon name="credit-card-1" />
              <span>{t.completePayment}</span>
            </Link>
          ) : null}
          <Link to="/orders/track" className="btn btn-ghost">
            <Icon name="search-1" />
            <span>{t.trackOrder}</span>
          </Link>
          <Link to="/" className="btn btn-ghost">
            <Icon name="arrow-left" />
            <span>{t.toCatalog}</span>
          </Link>
        </div>
      </article>
    </section>
  );
};
