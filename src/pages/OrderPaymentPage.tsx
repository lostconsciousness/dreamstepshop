import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useCurrency } from '../currency';
import { Icon } from '../components/Icon';
import { OrderEmailPrompt } from '../components/OrderEmailPrompt';
import { OrderSummary } from '../components/OrderSummary';
import { PaymentMethodPicker } from '../components/PaymentMethodPicker';
import { PriceDisplay } from '../components/PriceDisplay';
import { StateBlock } from '../components/State';
import { isOrderPaid, useOrderPayment } from '../hooks/useOrderPayment';
import { useI18n } from '../i18n';
import { rememberOrderAccess } from '../orderAccess';
import { getStoredOrderEmail, setStoredOrderEmail } from '../orderEmail';
import type { PaymentProvider } from '../payment';
import { getDisplayTotalFromLines } from '../pricing';
import { extractApiError } from '../utils';

export const OrderPaymentPage = () => {
  const { t } = useI18n();
  const { currency } = useCurrency();
  const navigate = useNavigate();
  const params = useParams();
  const orderId = Number(params.id);
  const orderPay = useOrderPayment();
  const [email, setEmail] = useState<string | null>(() => getStoredOrderEmail());
  const [provider, setProvider] = useState<PaymentProvider | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  const orderQuery = useQuery({
    queryKey: ['order', orderId, email, currency],
    queryFn: () => api.getOrder(orderId, email!),
    enabled: Number.isFinite(orderId) && Boolean(email),
  });

  const paymentoStatusQuery = useQuery({
    queryKey: ['paymento-status'],
    queryFn: api.getPaymentoStatus,
    staleTime: 60_000,
  });

  const paymentoAvailable = paymentoStatusQuery.data?.configured ?? false;
  const order = orderQuery.data;
  const paid = order ? isOrderPaid(order.status) : false;

  useEffect(() => {
    if (!provider && paymentoStatusQuery.isSuccess) {
      setProvider(paymentoAvailable ? 'paymento' : 'cryptocloud');
    }
  }, [paymentoAvailable, paymentoStatusQuery.isSuccess, provider]);

  useEffect(() => {
    if (order) {
      rememberOrderAccess(order.id);
      setStoredOrderEmail(order.email);
    }
  }, [order?.id, order?.email]);

  useEffect(() => {
    if (paid && order) {
      navigate(`/orders/${order.id}`, { replace: true });
    }
  }, [paid, order, navigate]);

  if (!Number.isFinite(orderId)) {
    return <StateBlock emoji="🤔" title={t.invalidOrderId} />;
  }

  if (!email) {
    return (
      <section className="content">
        <div className="section-header">
          <span className="eyebrow">{t.paymentPageEyebrow}</span>
          <h1>{t.orderEmailRequiredTitle}</h1>
          <p>{t.orderEmailRequiredSubtitle}</p>
        </div>
        <div className="checkout-card track-order-card">
          <OrderEmailPrompt onSubmit={setEmail} />
        </div>
      </section>
    );
  }

  if (orderQuery.isPending || paid) {
    return <StateBlock title={t.loadingOrder} />;
  }

  if (orderQuery.isError || !order) {
    return (
      <StateBlock
        emoji="⚠️"
        title={t.cannotLoadOrder}
        message={extractApiError(orderQuery.error)}
        actions={
          <Link to="/orders/track" className="btn btn-primary">
            {t.trackOrder}
          </Link>
        }
      />
    );
  }

  const orderCurrency = order.currency || order.lines[0]?.currency || 'UAH';

  const handleProceed = () => {
    if (!provider) {
      setPayError(t.choosePaymentMethod);
      return;
    }
    setPayError(null);
    orderPay.pay(order, provider);
  };

  return (
    <section className="content">
      <div className="section-header">
        <span className="eyebrow">{t.paymentPageEyebrow}</span>
        <h1>{t.paymentPageTitle(order.id)}</h1>
        <p>{t.paymentPageSubtitle}</p>
      </div>

      <div className="checkout-grid">
        <article className="checkout-card">
          <h2>{t.reviewOrderDetails}</h2>
          <OrderSummary order={order} />

          <div className="summary-divider" />

          <h3 className="form-section-title">{t.choosePaymentMethod}</h3>
          <PaymentMethodPicker
            value={provider}
            onChange={setProvider}
            paymentoAvailable={paymentoAvailable}
            disabled={orderPay.isPaying}
          />

          {payError ? <p className="toast error">{payError}</p> : null}
          {orderPay.error ? (
            <p className="toast error">{extractApiError(orderPay.error)}</p>
          ) : null}

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleProceed}
            disabled={orderPay.isPaying || !provider}
          >
            <Icon name="credit-card-1" />
            <span>{orderPay.isPaying ? t.redirectingToPay : t.proceedToPayment}</span>
          </button>

          <Link to={`/orders/${order.id}`} className="btn btn-ghost btn-block">
            {t.viewOrder}
          </Link>
        </article>

        <aside className="summary-card summary-card--sticky">
          <h2 style={{ margin: 0, fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
            {t.amountDue}
          </h2>
          <p className="payment-amount-due">
            <PriceDisplay
              amount={getDisplayTotalFromLines(order.lines)}
              currency={orderCurrency}
              size="lg"
            />
          </p>
          <p className="input-hint">{t.paymentAmountHint}</p>
        </aside>
      </div>
    </section>
  );
};
