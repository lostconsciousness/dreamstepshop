import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useCurrency } from '../currency';
import { Icon } from '../components/Icon';
import { PriceDisplay } from '../components/PriceDisplay';
import { StateBlock } from '../components/State';
import { isOrderPaid, useOrderPayment } from '../hooks/useOrderPayment';
import { useI18n } from '../i18n';
import type { ShippingAddress } from '../types';
import { getDisplayTotalFromLines } from '../pricing';
import { extractApiError } from '../utils';

const formatShippingBlock = (s: ShippingAddress): string => {
  const lines: string[] = [s.country];
  if (s.region) {
    lines.push(s.region);
  }
  const cityLine = [s.postal_code, s.city].filter(Boolean).join(' ').trim();
  if (cityLine) {
    lines.push(cityLine);
  }
  lines.push(s.address_line);
  return lines.filter(Boolean).join('\n');
};

export const OrderPage = () => {
  const { t } = useI18n();
  const { currency } = useCurrency();
  const params = useParams();
  const orderId = Number(params.id);
  const orderPay = useOrderPayment();

  const orderQuery = useQuery({
    queryKey: ['order', orderId, currency],
    queryFn: () => api.getOrder(orderId),
    enabled: Number.isFinite(orderId),
  });

  if (!Number.isFinite(orderId)) {
    return <StateBlock emoji="🤔" title={t.invalidOrderId} />;
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
      />
    );
  }

  const order = orderQuery.data;
  const totalQty = order.lines.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);
  const orderCurrency = order.currency || order.lines[0]?.currency || 'UAH';
  const paid = isOrderPaid(order.status);

  return (
    <section className="content">
      <div className="section-header">
        <span className="eyebrow">{t.order} #{order.id}</span>
        <h1>
          {t.order} #{order.id}
        </h1>
        <span className="status-pill">{order.status}</span>
      </div>

      <article className="checkout-card">
        <div className="order-detail-block">
          <h3 className="form-section-title">{t.sectionContact}</h3>
          {order.recipient_name ? (
            <p>
              <span className="muted">{t.recipientNameLabel}</span>
              {order.recipient_name}
            </p>
          ) : null}
          <p>
            <span className="muted">{t.emailLabel}</span>
            {order.email}
          </p>
          {order.phone ? (
            <p>
              <span className="muted">{t.phoneLabel}</span>
              {order.phone}
            </p>
          ) : null}
          {order.telegram_username ? (
            <p>
              <span className="muted">{t.telegramLabel}</span>
              {order.telegram_username}
            </p>
          ) : null}
        </div>

        {order.shipping ? (
          <div className="order-detail-block">
            <h3 className="form-section-title">{t.sectionShipping}</h3>
            <p className="order-detail-multiline">{formatShippingBlock(order.shipping)}</p>
          </div>
        ) : null}

        {order.shipping_notes ? (
          <div className="order-detail-block">
            <h3 className="form-section-title">{t.notesHeading}</h3>
            <p className="order-detail-multiline">{order.shipping_notes}</p>
          </div>
        ) : null}

        <h2>{t.positions}</h2>
        <div className="order-lines">
          {order.lines.map((line, index) => (
            <div key={`${line.sku}-${index}`} className="order-line">
              <div>
                <p className="order-line-name">{line.product_name}</p>
                <p className="order-line-meta">
                  {t.size}: <strong>{line.size}</strong> · {line.quantity} ×{' '}
                  <PriceDisplay value={line.unit_price} currency={line.currency} size="sm" />
                </p>
              </div>
              <PriceDisplay
                value={line.unit_price}
                currency={line.currency}
                quantity={line.quantity}
                size="sm"
              />
            </div>
          ))}
        </div>

        <div className="summary-divider" />

        <div className="summary-row">
          <span className="muted">{t.items}</span>
          <span>{t.itemsCount(totalQty)}</span>
        </div>
        <div className="summary-row large">
          <span>{t.total}</span>
          <PriceDisplay amount={getDisplayTotalFromLines(order.lines)} currency={orderCurrency} />
        </div>

        {paid ? <p className="toast success">{t.paymentDone}</p> : null}

        <div className="add-row">
          {!paid ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => orderPay.pay(order)}
              disabled={orderPay.isPaying}
            >
              <Icon name="credit-card-1" />
              <span>{orderPay.isPaying ? t.redirectingToPay : t.payCrypto}</span>
            </button>
          ) : null}
          <Link to="/" className="btn btn-ghost">
            <Icon name="arrow-left" />
            <span>{t.toCatalog}</span>
          </Link>
        </div>

        {orderPay.error ? (
          <p className="toast error">{extractApiError(orderPay.error)}</p>
        ) : null}
      </article>
    </section>
  );
};
