import { formatDisplayPrice, getDisplayUnitPrice } from '../pricing';
import { formatPrice } from '../utils';

type PriceDisplayProps = {
  /** Sale unit price from the API. */
  value?: string | number;
  /** Precomputed display amount (e.g. cart total). Skips discount conversion. */
  amount?: number;
  currency: string;
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const PriceDisplay = ({
  value = 0,
  amount,
  currency,
  quantity = 1,
  size = 'md',
  className,
}: PriceDisplayProps) => {
  const classes = ['price-display', `price-display--${size}`, className].filter(Boolean).join(' ');
  const label =
    amount !== undefined
      ? formatPrice(amount, currency)
      : formatDisplayPrice(value, currency, quantity);

  return (
    <span className={classes}>
      <span className="price-display-sale">{label}</span>
    </span>
  );
};

export { getDisplayUnitPrice };
