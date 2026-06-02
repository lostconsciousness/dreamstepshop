import { PriceDisplay } from './PriceDisplay';
import { useI18n } from '../i18n';
import type { Order, ShippingAddress } from '../types';
import { getDisplayTotalFromLines } from '../pricing';

const formatShippingBlock = (shipping: ShippingAddress): string => {
  const lines: string[] = [shipping.country];
  if (shipping.region) {
    lines.push(shipping.region);
  }
  const cityLine = [shipping.postal_code, shipping.city].filter(Boolean).join(' ').trim();
  if (cityLine) {
    lines.push(cityLine);
  }
  lines.push(shipping.address_line);
  return lines.filter(Boolean).join('\n');
};

type OrderSummaryProps = {
  order: Order;
  showContact?: boolean;
  showShipping?: boolean;
  showLines?: boolean;
  showTotal?: boolean;
};

export const OrderSummary = ({
  order,
  showContact = true,
  showShipping = true,
  showLines = true,
  showTotal = true,
}: OrderSummaryProps) => {
  const { t } = useI18n();
  const totalQty = order.lines.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);
  const orderCurrency = order.currency || order.lines[0]?.currency || 'UAH';

  return (
    <>
      {showContact ? (
        <div className="order-detail-block">
          <h3 className="form-section-title">{t.sectionContact}</h3>
          {order.recipient_name ? (
            <p>
              <span className="muted">{t.recipientNameLabel}: </span>
              {order.recipient_name}
            </p>
          ) : null}
          <p>
            <span className="muted">{t.emailLabel}: </span>
            {order.email}
          </p>
          {order.phone ? (
            <p>
              <span className="muted">{t.phoneLabel}: </span>
              {order.phone}
            </p>
          ) : null}
          {order.telegram_username ? (
            <p>
              <span className="muted">{t.telegramLabel}: </span>
              {order.telegram_username}
            </p>
          ) : null}
        </div>
      ) : null}

      {showShipping && order.shipping ? (
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

      {showLines ? (
        <>
          <h2 className="order-summary-lines-title">{t.positions}</h2>
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
        </>
      ) : null}

      {showTotal ? (
        <>
          <div className="summary-divider" />
          <div className="summary-row">
            <span className="muted">{t.items}</span>
            <span>{t.itemsCount(totalQty)}</span>
          </div>
          <div className="summary-row large">
            <span>{t.total}</span>
            <PriceDisplay amount={getDisplayTotalFromLines(order.lines)} currency={orderCurrency} />
          </div>
        </>
      ) : null}
    </>
  );
};
