import { DISCOUNT_PERCENT } from '../pricing';

type DiscountBadgeProps = {
  className?: string;
};

export const DiscountBadge = ({ className }: DiscountBadgeProps) => {
  const classes = ['discount-badge', className].filter(Boolean).join(' ');
  return (
    <span className={classes} aria-label={`${DISCOUNT_PERCENT}% off`}>
      -{DISCOUNT_PERCENT}%
    </span>
  );
};
