export const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;

export type StandardSize = (typeof STANDARD_SIZES)[number];

export const FOOTWEAR_SIZES = Array.from({ length: 10 }, (_, index) => String(35 + index));

export type ProductSizeDisplayMode = 'clothing' | 'footwear' | 'none';

const FOOTWEAR_CATEGORIES = new Set(['Обувь', 'Shoes', 'Footwear']);
const NO_SIZE_CATEGORIES = new Set(['Посуда', 'Drinkware', 'Аксессуары', 'Accessories']);
const CLOTHING_CATEGORIES = new Set(['Одежда', 'Apparel', 'Clothing']);

const normalizeSize = (size: string): string => size.trim().toUpperCase();

export const getProductSizeDisplayMode = (category: string | null): ProductSizeDisplayMode => {
  const normalized = category?.trim() ?? '';
  if (FOOTWEAR_CATEGORIES.has(normalized)) {
    return 'footwear';
  }
  if (NO_SIZE_CATEGORIES.has(normalized)) {
    return 'none';
  }
  if (CLOTHING_CATEGORIES.has(normalized)) {
    return 'clothing';
  }
  return 'clothing';
};

export const isStandardSize = (size: string): boolean =>
  STANDARD_SIZES.includes(normalizeSize(size) as StandardSize);

export const filterStandardVariants = <T extends { size: string }>(variants: T[]): T[] =>
  variants.filter((variant) => isStandardSize(variant.size));

export const getPurchasableVariants = <T extends { size: string }>(
  variants: T[],
  mode: ProductSizeDisplayMode,
): T[] => (mode === 'clothing' ? filterStandardVariants(variants) : variants);

export const getDefaultVariant = <T extends { size: string; stock: number }>(
  variants: T[],
  mode: ProductSizeDisplayMode,
): T | undefined => {
  const pool = mode === 'clothing' ? filterStandardVariants(variants) : variants;
  return pool.find((variant) => variant.stock > 0) ?? pool[0];
};

export const getStandardSizeLabels = <T extends { size: string; stock?: number }>(
  variants: T[],
): StandardSize[] =>
  STANDARD_SIZES.filter((size) =>
    variants.some((variant) => normalizeSize(variant.size) === size),
  );
