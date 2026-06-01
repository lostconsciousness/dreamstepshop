import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useCurrency } from '../currency';
import { Icon } from './Icon';
import { useI18n } from '../i18n';
import type { Product } from '../types';
import { getProductImageSrc, PRODUCT_PLACEHOLDER_IMAGE } from '../media';
import { getDefaultVariant, getProductSizeDisplayMode } from '../sizes';
import { extractApiError } from '../utils';

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { t } = useI18n();
  const { currency } = useCurrency();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<string | null>(null);
  const isNew = index < 2;
  const productUrl = `/products/${product.id}`;

  const sizeMode = getProductSizeDisplayMode(product.category);
  const defaultVariant = getDefaultVariant(product.variants, sizeMode);
  const canAdd = Boolean(defaultVariant && defaultVariant.stock > 0);

  const addToCartMutation = useMutation({
    mutationFn: api.addCartItem,
    onSuccess: (cart) => {
      setFeedback(t.addedToCart);
      queryClient.setQueryData(['cart', currency], cart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      window.setTimeout(() => setFeedback(null), 2500);
    },
    onError: (error) => {
      setFeedback(extractApiError(error));
      window.setTimeout(() => setFeedback(null), 3500);
    },
  });

  const handleAddToCart = () => {
    if (!defaultVariant || defaultVariant.stock <= 0) {
      return;
    }
    addToCartMutation.mutate({
      variant_id: defaultVariant.id,
      quantity: 1,
    });
  };

  return (
    <article className="product-card">
      <Link to={productUrl} className="product-card-media" aria-label={product.name}>
        <div className="product-image-wrap">
          <div className="product-image-badges">
            {isNew ? <span className="product-badge product-badge--new">{t.heroBadge}</span> : null}
          </div>
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
      </Link>

      <div className="product-card-content">
        <Link to={productUrl} className="product-card-title-link">
          <h3>{product.name}</h3>
        </Link>

        <div className="product-card-actions">
          <button
            type="button"
            className="btn btn-primary btn-block product-card-btn"
            onClick={handleAddToCart}
            disabled={!canAdd || addToCartMutation.isPending}
          >
            <Icon name="cart-plus" />
            <span>{addToCartMutation.isPending ? t.adding : t.addToCart}</span>
          </button>
          <Link to={productUrl} className="btn btn-ghost btn-block product-card-btn">
            <Icon name="arrow-right" />
            <span>{t.viewProduct}</span>
          </Link>
        </div>

        {feedback ? <p className="product-card-feedback">{feedback}</p> : null}
      </div>
    </article>
  );
};
