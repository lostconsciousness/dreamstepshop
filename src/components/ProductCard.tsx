import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import type { ProductCategory } from '../categories';
import type { Product } from '../types';
import { getProductImageSrc, PRODUCT_PLACEHOLDER_IMAGE } from '../media';
import { formatPriceWithDiscount, toNumber } from '../utils';

const getPriceLabel = (product: Product, fallback: string): string => {
  if (product.variants.length === 0) {
    return fallback;
  }
  const currency = product.variants[0]?.currency ?? 'UAH';
  const prices = product.variants.map((variant) => toNumber(variant.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) {
    return formatPriceWithDiscount(min, currency);
  }
  return `${formatPriceWithDiscount(min, currency)} — ${formatPriceWithDiscount(max, currency)}`;
};

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { t } = useI18n();
  const isNew = index < 2;
  const categoryLabel = product.category
    ? t.categoryLabel(product.category as ProductCategory)
    : null;

  return (
    <Link to={`/products/${product.id}`} className="product-card" aria-label={product.name}>
      <div className="product-image-wrap">
        {isNew ? <span className="product-tag">{t.heroBadge}</span> : null}
        {categoryLabel ? (
          <span className="product-tag product-tag-category">{categoryLabel}</span>
        ) : null}
        <img
          src={getProductImageSrc(product.image_url)}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
          }}
        />
      </div>
      <div className="product-card-content">
        <h3>{product.name}</h3>
        <p className="price">{getPriceLabel(product, t.priceOnRequest)}</p>
      </div>
    </Link>
  );
};
