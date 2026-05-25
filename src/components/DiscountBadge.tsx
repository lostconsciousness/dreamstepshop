import { DISCOUNT_PERCENT } from '../pricing';

type DiscountBadgeProps = {
  className?: string;
};

export const DiscountBadge = ({ className }: DiscountBadgeProps) => {
  const classes = ['product-tag', 'product-tag-discount', className].filter(Boolean).join(' ');
  return <span className={classes}>-{DISCOUNT_PERCENT}%</span>;
};
