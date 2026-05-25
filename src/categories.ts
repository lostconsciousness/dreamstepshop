import type { Product } from './types';

export type ProductCategory = string;

export const getCategoriesFromProducts = (products: Product[]): ProductCategory[] => {
  return Array.from(
    new Set(products.map((p) => p.category?.trim()).filter((c): c is string => Boolean(c))),
  );
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
