import { formatPrice, toNumber } from './utils';

export const DISCOUNT_PERCENT = 80;

/** API prices are sale prices; derive the full list price shown in the storefront. */
export const getDisplayUnitPrice = (salePrice: string | number): number => {
  const sale = toNumber(salePrice);
  if (sale <= 0) {
    return 0;
  }
  const multiplier = 1 - DISCOUNT_PERCENT / 100;
  return multiplier > 0 ? sale / multiplier : sale;
};

export const getDisplayLineTotal = (unitPrice: string | number, quantity: number): number =>
  getDisplayUnitPrice(unitPrice) * (Number(quantity) || 0);

export const getDisplayTotalFromLines = (
  lines: Array<{ unit_price: string; quantity: number }>,
): number =>
  lines.reduce((sum, line) => sum + getDisplayLineTotal(line.unit_price, line.quantity), 0);

export const formatDisplayPrice = (
  salePrice: string | number,
  currency: string,
  quantity = 1,
): string => formatPrice(getDisplayUnitPrice(salePrice) * quantity, currency);

export const formatDisplayTotalFromLines = (
  lines: Array<{ unit_price: string; quantity: number }>,
  currency: string,
): string => formatPrice(getDisplayTotalFromLines(lines), currency);

/** @deprecated Use getDisplayUnitPrice */
export const getOriginalPrice = getDisplayUnitPrice;

/** @deprecated Use formatDisplayPrice */
export const formatOriginalPrice = (salePrice: string | number, currency: string): string =>
  formatDisplayPrice(salePrice, currency);
