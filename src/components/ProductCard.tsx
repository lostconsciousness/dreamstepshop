import { Link } from 'react-router-dom';
import { DiscountBadge } from './DiscountBadge';
import { PriceDisplay } from './PriceDisplay';
import { useI18n } from '../i18n';
import type { ProductCategory } from '../categories';
import type { Product } from '../types';
import { getProductImageSrc, PRODUCT_PLACEHOLDER_IMAGE } from '../media';
import { toNumber } from '../utils';

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { t } = useI18n();
  const isNew = index < 2;
  const categoryLabel = product.category
    ? t.categoryLabel(product.category as ProductCategory)
    : null;

  const prices = product.variants.map((variant) => toNumber(variant.price));
  const currency = product.variants[0]?.currency ?? 'USD';
  const min = prices.length ? Math.min(...prices) : null;
  const max = prices.length ? Math.max(...prices) : null;

  return (
    <Link to={`/products/${product.id}`} className="product-card" aria-label={product.name}>
      <div className="product-image-wrap">
        <DiscountBadge />
        {isNew ? <span className="product-tag product-tag-new">{t.heroBadge}</span> : null}
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
        {min !== null && max !== null ? (
          <div className="price-row">
            <PriceDisplay value={min} currency={currency} />
            {min !== max ? (
              <>
                <span className="price-range-sep">—</span>
                <PriceDisplay value={max} currency={currency} size="sm" />
              </>
            ) : null}
          </div>
        ) : (
          <p className="muted">{t.priceOnRequest}</p>
        )}
      </div>
    </Link>
  );
};
