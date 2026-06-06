import {
  DISCOUNT_PERCENT,
  formatSalePrice,
  getListUnitPrice,
  getSaleUnitPrice,
} from '../pricing';
import { formatPrice } from '../utils';

type PriceDisplayProps = {
  /** Sale unit price from the API. */
  value?: string | number;
  /** Precomputed sale total (e.g. cart total). */
  amount?: number;
  /** Precomputed list total for strikethrough when using `amount`. */
  originalAmount?: number;
  currency: string;
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDiscount?: boolean;
};

export const PriceDisplay = ({
  value = 0,
  amount,
  originalAmount,
  currency,
  quantity = 1,
  size = 'md',
  className,
  showDiscount = true,
}: PriceDisplayProps) => {
  const classes = ['price-display', `price-display--${size}`, className].filter(Boolean).join(' ');

  const saleTotal =
    amount !== undefined ? amount : getSaleUnitPrice(value) * (Number(quantity) || 1);
  const listTotal =
    originalAmount !== undefined
      ? originalAmount
      : getListUnitPrice(value) * (Number(quantity) || 1);

  const saleLabel =
    amount !== undefined ? formatPrice(amount, currency) : formatSalePrice(value, currency, quantity);

  const shouldShowOriginal =
    showDiscount &&
    DISCOUNT_PERCENT > 0 &&
    listTotal > saleTotal + 0.001;

  return (
    <span className={classes}>
      <span className="price-display-sale">{saleLabel}</span>
      {shouldShowOriginal ? (
        <span className="price-display-original">{formatPrice(listTotal, currency)}</span>
      ) : null}
    </span>
  );
};

export { getSaleUnitPrice as getDisplayUnitPrice };
