import { formatPrice, toNumber } from './utils';

export const DISCOUNT_PERCENT = 80;

const listPriceMultiplier = (): number => {
  const saleShare = 1 - DISCOUNT_PERCENT / 100;
  return saleShare > 0 ? 1 / saleShare : 1;
};

/** API unit price — sale price the customer pays. */
export const getSaleUnitPrice = (salePrice: string | number): number => {
  const sale = toNumber(salePrice);
  return sale > 0 ? sale : 0;
};

/** Full list price before the storefront discount. */
export const getListUnitPrice = (salePrice: string | number): number => {
  const sale = getSaleUnitPrice(salePrice);
  return sale > 0 ? sale * listPriceMultiplier() : 0;
};

export const getSaleLineTotal = (unitPrice: string | number, quantity: number): number =>
  getSaleUnitPrice(unitPrice) * (Number(quantity) || 0);

export const getListLineTotal = (unitPrice: string | number, quantity: number): number =>
  getListUnitPrice(unitPrice) * (Number(quantity) || 0);

export const getSaleTotalFromLines = (
  lines: Array<{ unit_price: string; quantity: number }>,
): number => lines.reduce((sum, line) => sum + getSaleLineTotal(line.unit_price, line.quantity), 0);

export const getListTotalFromLines = (
  lines: Array<{ unit_price: string; quantity: number }>,
): number => lines.reduce((sum, line) => sum + getListLineTotal(line.unit_price, line.quantity), 0);

export const formatSalePrice = (
  salePrice: string | number,
  currency: string,
  quantity = 1,
): string => formatPrice(getSaleUnitPrice(salePrice) * quantity, currency);

export const formatSaleTotalFromLines = (
  lines: Array<{ unit_price: string; quantity: number }>,
  currency: string,
): string => formatPrice(getSaleTotalFromLines(lines), currency);

/** @deprecated Use getSaleUnitPrice */
export const getDisplayUnitPrice = getSaleUnitPrice;

/** @deprecated Use getSaleTotalFromLines */
export const getDisplayTotalFromLines = getSaleTotalFromLines;

/** @deprecated Use formatSalePrice */
export const formatDisplayPrice = formatSalePrice;

/** @deprecated Use formatSaleTotalFromLines */
export const formatDisplayTotalFromLines = formatSaleTotalFromLines;

/** @deprecated Use getListUnitPrice */
export const getOriginalPrice = getListUnitPrice;

/** @deprecated Use formatSalePrice for sale; use getListUnitPrice for list */
export const formatOriginalPrice = (salePrice: string | number, currency: string): string =>
  formatPrice(getListUnitPrice(salePrice), currency);
