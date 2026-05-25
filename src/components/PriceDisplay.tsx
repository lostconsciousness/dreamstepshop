import { formatOriginalPrice } from '../pricing';
import { formatPrice } from '../utils';

type PriceDisplayProps = {
  value: string | number;
  currency: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const PriceDisplay = ({
  value,
  currency,
  size = 'md',
  className,
}: PriceDisplayProps) => {
  const classes = ['price-display', `price-display--${size}`, className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      <span className="price-display-sale">{formatPrice(value, currency)}</span>
      <span className="price-display-original">{formatOriginalPrice(value, currency)}</span>
    </span>
  );
};
