import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import type { Product } from '../types';
import { formatPrice, toNumber } from '../utils';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80';

const getPriceLabel = (product: Product, fallback: string): string => {
  if (product.variants.length === 0) {
    return fallback;
  }
  const currency = product.variants[0]?.currency ?? 'UAH';
  const prices = product.variants.map((variant) => toNumber(variant.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) {
    return formatPrice(min, currency);
  }
  return `${formatPrice(min, currency)} — ${formatPrice(max, currency)}`;
};

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { t } = useI18n();
  const isNew = index < 2;

  return (
    <Link to={`/products/${product.id}`} className="product-card" aria-label={product.name}>
      <div className="product-image-wrap">
        {isNew ? <span className="product-tag">{t.heroBadge}</span> : null}
        <img
          src={product.image_url ?? PLACEHOLDER_IMAGE}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </div>
      <div className="product-card-content">
        <h3>{product.name}</h3>
        <p className="price">{getPriceLabel(product, t.priceOnRequest)}</p>
      </div>
    </Link>
  );
};
