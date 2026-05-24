import type { Product } from './types';

/** Category slugs from API `ProductOut.category`. */
export const PRODUCT_CATEGORIES = ['Одежда', 'Обувь', 'Аксессуары', 'Посуда'] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const isProductCategory = (value: string): value is ProductCategory => {
  return (PRODUCT_CATEGORIES as readonly string[]).includes(value);
};

export const getCategoriesFromProducts = (products: Product[]): ProductCategory[] => {
  const present = new Set(
    products.map((p) => p.category).filter((c): c is string => Boolean(c && isProductCategory(c))),
  );
  return PRODUCT_CATEGORIES.filter((c) => present.has(c));
};

export const filterProductsByCategory = (
  products: Product[],
  category: ProductCategory | null,
): Product[] => {
  const active = products.filter((p) => p.is_active !== false);
  if (!category) {
    return active;
  }
  return active.filter((p) => p.category === category);
};
