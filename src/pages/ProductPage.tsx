import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import type { ProductCategory } from '../categories';
import { useCurrency } from '../currency';
import { Icon } from '../components/Icon';
import { DiscountBadge } from '../components/DiscountBadge';
import { PriceDisplay } from '../components/PriceDisplay';
import { StateBlock } from '../components/State';
import { useI18n } from '../i18n';
import { getProductImageSrc, PRODUCT_PLACEHOLDER_IMAGE } from '../media';
import { splitDescriptionParagraphs } from '../text';
import { formatSalePrice } from '../pricing';
import {
  FOOTWEAR_SIZES,
  getDefaultVariant,
  getProductSizeDisplayMode,
  getPurchasableVariants,
  getStandardSizeLabels,
} from '../sizes';
import { extractApiError } from '../utils';

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
  const [selectedFootwearSize, setSelectedFootwearSize] = useState('40');
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
  const sizeMode = getProductSizeDisplayMode(product.category);
  const variants = getPurchasableVariants(product.variants, sizeMode);
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ??
    getDefaultVariant(product.variants, sizeMode);

  const maxQty = Math.max(selectedVariant?.stock ?? 1, 1);
  const variantCurrency = selectedVariant?.currency ?? 'UAH';
  const descriptionText = product.description?.trim() || t.productDescriptionFallback;
  const descriptionParagraphs = splitDescriptionParagraphs(descriptionText);
  const availableSizes =
    sizeMode === 'clothing'
      ? getStandardSizeLabels(variants.filter((variant) => variant.stock > 0)).join(', ')
      : '';

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
        <div className="detail-media">
          <div className="detail-image-wrap">
            <DiscountBadge className="detail-discount-badge" />
            <img
              src={getProductImageSrc(product.image_url)}
              alt={product.name}
              className="detail-image"
              onError={(event) => {
                event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
              }}
            />
          </div>
        </div>

        <div className="detail-content">
          <header className="detail-header">
            {product.category ? (
              <span className="detail-category">
                {t.categoryLabel(product.category as ProductCategory)}
              </span>
            ) : null}
            <h1 className="detail-title">{product.name}</h1>
            {selectedVariant ? (
              <PriceDisplay
                value={selectedVariant.price}
                currency={variantCurrency}
                size="lg"
                className="price-strong"
              />
            ) : null}
          </header>

          <section className="detail-about" aria-labelledby="product-about-heading">
            <h2 id="product-about-heading" className="detail-section-title">
              {t.productAbout}
            </h2>
            <div className="detail-description-body">
              {descriptionParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="detail-meta" aria-label={t.productDetails}>
            <div className="detail-meta-item">
              <span className="detail-meta-label">{t.productDetails}</span>
              <span className="detail-meta-value">{t.officialMerch}</span>
            </div>
            {selectedVariant?.sku ? (
              <div className="detail-meta-item">
                <span className="detail-meta-label">{t.productSku}</span>
                <span className="detail-meta-value">{selectedVariant.sku}</span>
              </div>
            ) : null}
            {availableSizes ? (
              <div className="detail-meta-item">
                <span className="detail-meta-label">{t.productAvailableSizes}</span>
                <span className="detail-meta-value">{availableSizes}</span>
              </div>
            ) : null}
          </section>

          <section className="detail-purchase">
            {sizeMode !== 'none' ? (
              <>
                <span className="field-label">{t.chooseSize}</span>
                {sizeMode === 'footwear' ? (
                  <div className="variant-grid variant-grid--footwear">
                    {FOOTWEAR_SIZES.map((size) => {
                      const isSelected = selectedFootwearSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          className={isSelected ? 'chip chip--size-only active' : 'chip chip--size-only'}
                          onClick={() => setSelectedFootwearSize(size)}
                        >
                          <span className="chip-size">{size}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="variant-grid">
                    {variants.map((variant) => {
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
                            <PriceDisplay value={variant.price} currency={variant.currency} size="sm" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : null}

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
                          : `${t.addToCart} · ${formatSalePrice(
                              selectedVariant.price,
                              variantCurrency,
                              quantity,
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
          </section>
        </div>
      </article>
    </div>
  );
};
