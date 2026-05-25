import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import type { ProductCategory } from '../categories';
import { useCurrency } from '../currency';
import { Icon } from '../components/Icon';
import { StateBlock } from '../components/State';
import { useI18n } from '../i18n';
import { getProductImageSrc, PRODUCT_PLACEHOLDER_IMAGE } from '../media';
import { extractApiError, formatPriceWithDiscount, toNumber } from '../utils';

type Feedback = {
  tone: 'success' | 'error';
  text: string;
};

export const ProductPage = () => {
  const { t, language } = useI18n();
  const { currency } = useCurrency();
  const params = useParams();
  const navigate = useNavigate();
  const productId = Number(params.id);
  const queryClient = useQueryClient();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const productQuery = useQuery({
    queryKey: ['product', productId, currency, language],
    queryFn: () => api.getProduct(productId, language),
    enabled: Number.isFinite(productId),
  });

  const addToCartMutation = useMutation({
    mutationFn: api.addCartItem,
    onSuccess: (cart) => {
      setFeedback({ tone: 'success', text: t.addedToCart });
      queryClient.setQueryData(['cart', currency], cart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      setFeedback({ tone: 'error', text: extractApiError(error) });
    },
  });

  useEffect(() => {
    if (!feedback) return;
    const id = window.setTimeout(() => setFeedback(null), 3500);
    return () => window.clearTimeout(id);
  }, [feedback]);

  if (!Number.isFinite(productId)) {
    return <StateBlock emoji="🤔" title={t.invalidProductId} />;
  }

  if (productQuery.isPending) {
    return <StateBlock title={t.loadingProduct} />;
  }

  if (productQuery.isError) {
    return (
      <StateBlock
        emoji="⚠️"
        title={t.cannotLoadProduct}
        message={extractApiError(productQuery.error)}
      />
    );
  }

  const product = productQuery.data;
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ??
    product.variants.find((variant) => variant.stock > 0) ??
    product.variants[0];

  const maxQty = Math.max(selectedVariant?.stock ?? 1, 1);
  const variantCurrency = selectedVariant?.currency ?? 'UAH';

  const handleAddToCart = () => {
    if (!selectedVariant) {
      setFeedback({ tone: 'error', text: t.noVariants });
      return;
    }
    if (quantity < 1) {
      setFeedback({ tone: 'error', text: t.qtyPositive });
      return;
    }
    addToCartMutation.mutate({
      variant_id: selectedVariant.id,
      quantity,
    });
  };

  const increment = () => setQuantity((q) => Math.min(q + 1, maxQty));
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

  return (
    <div className="product-page">
      <Link to="/" className="back-link">
        <Icon name="arrow-left" />
        <span>{t.backToCatalog}</span>
      </Link>

      <article className="product-detail">
        <div className="detail-image-wrap">
          <img
            src={getProductImageSrc(product.image_url)}
            alt={product.name}
            className="detail-image"
            onError={(event) => {
              event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
            }}
          />
        </div>
        <div className="detail-content">
          {product.category ? (
            <span className="detail-category">
              {t.categoryLabel(product.category as ProductCategory)}
            </span>
          ) : null}
          <h1 className="detail-title">{product.name}</h1>
          {product.description ? (
            <p className="detail-description">{product.description}</p>
          ) : null}

          {selectedVariant ? (
            <p className="price price-strong">
              {formatPriceWithDiscount(selectedVariant.price, variantCurrency)}
            </p>
          ) : null}

          <span className="field-label">{t.chooseSize}</span>
          <div className="variant-grid">
            {product.variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const disabled = variant.stock <= 0;
              return (
                <button
                  key={variant.id}
                  type="button"
                  className={isSelected ? 'chip active' : 'chip'}
                  disabled={disabled}
                  onClick={() => setSelectedVariantId(variant.id)}
                >
                  <span className="chip-size">{variant.size}</span>
                  <span className="chip-meta">
                    {formatPriceWithDiscount(variant.price, variant.currency)}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedVariant ? (
            <div className="detail-actions">
              <div className="qty-row">
                <span className="field-label">{t.quantity}</span>
                <div className="qty-control" role="group" aria-label={t.quantity}>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={decrement}
                    disabled={quantity <= 1}
                    aria-label="−"
                  >
                    <Icon name="minus" />
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={maxQty}
                    value={quantity}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      if (!Number.isFinite(next)) {
                        setQuantity(1);
                        return;
                      }
                      setQuantity(Math.min(Math.max(Math.trunc(next), 1), maxQty));
                    }}
                    className="qty-input"
                  />
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={increment}
                    disabled={quantity >= maxQty}
                    aria-label="+"
                  >
                    <Icon name="plus" />
                  </button>
                </div>
              </div>

              <div className="add-row">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending || selectedVariant.stock <= 0}
                >
                  <Icon name={selectedVariant.stock <= 0 ? 'ban' : 'cart-plus'} />
                  <span>
                    {addToCartMutation.isPending
                      ? t.adding
                      : selectedVariant.stock <= 0
                        ? t.outOfStockShort
                        : `${t.addToCart} · ${formatPriceWithDiscount(
                            toNumber(selectedVariant.price) * quantity,
                            variantCurrency,
                          )}`}
                  </span>
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate('/cart')}
                >
                  <Icon name="cart-1" />
                  <span>{t.yourCart}</span>
                </button>
              </div>
            </div>
          ) : (
            <StateBlock title={t.noVariants} />
          )}

          {feedback ? (
            <p className={feedback.tone === 'success' ? 'toast success' : 'toast error'}>
              {feedback.text}
            </p>
          ) : null}
        </div>
      </article>
    </div>
  );
};
