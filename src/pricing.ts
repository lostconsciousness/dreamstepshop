import { formatPrice, toNumber } from './utils';

export const DISCOUNT_PERCENT = 80;

/** API prices are already discounted; derive pre-discount list price. */
export const getOriginalPrice = (salePrice: string | number): number => {
  const sale = toNumber(salePrice);
  if (sale <= 0) {
    return 0;
  }
  const multiplier = 1 - DISCOUNT_PERCENT / 100;
  return multiplier > 0 ? sale / multiplier : sale;
};

export const formatOriginalPrice = (salePrice: string | number, currency: string): string => {
  return formatPrice(getOriginalPrice(salePrice), currency);
};
