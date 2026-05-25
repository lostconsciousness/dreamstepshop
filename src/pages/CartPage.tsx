import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api, getStoredCartToken } from '../api';
import { useCurrency } from '../currency';
import { Icon } from '../components/Icon';
import { StateBlock } from '../components/State';
import { useI18n } from '../i18n';
import { getProductImageSrc, PRODUCT_PLACEHOLDER_IMAGE } from '../media';
import { extractApiError, formatPriceWithDiscount } from '../utils';

export const CartPage = () => {
  const { t, language } = useI18n();
  const { currency } = useCurrency();
  const queryClient = useQueryClient();
  const hasToken = Boolean(getStoredCartToken());

  const cartQuery = useQuery({
    queryKey: ['cart', currency],
    queryFn: api.getCart,
    enabled: hasToken,
  });

  const productsQuery = useQuery({
    queryKey: ['products', language],
    queryFn: () => api.getProducts(language),
    staleTime: 60_000,
  });

  const updateQty = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      api.patchCartItem(itemId, { quantity }),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart', currency], cart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItem = useMutation({
    mutationFn: api.deleteCartItem,
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart', currency], cart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  if (!hasToken) {
    return (
      <StateBlock
        emoji="🛍"
        title={t.emptyCart}
        message={t.addFromCatalog}
        actions={
          <Link to="/" className="btn btn-primary">
            {t.toCatalog}
          </Link>
        }
      />
    );
  }

  if (cartQuery.isPending) {
    return <StateBlock title={t.loadingCart} />;
  }

  if (cartQuery.isError) {
    return (
      <StateBlock
        emoji="⚠️"
        title={t.cannotLoadCart}
        message={extractApiError(cartQuery.error)}
      />
    );
  }

  const cart = cartQuery.data;
  const cartLines = cart && Array.isArray(cart.lines) ? cart.lines : [];
  const imageByVariantId = new Map<number, string | null>();
  if (productsQuery.data) {
    for (const product of productsQuery.data) {
      for (const variant of product.variants) {
        imageByVariantId.set(variant.id, product.image_url);
      }
    }
  }

  if (!cart || cartLines.length === 0) {
    return (
      <StateBlock
        emoji="🛒"
        title={t.emptyCart}
        message={t.chooseFromCatalog}
        actions={
          <Link to="/" className="btn btn-primary">
            {t.toCatalog}
          </Link>
        }
      />
    );
  }

  const totalQty = cartLines.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);
  const cartCurrency = cart.currency || cartLines[0]?.currency || 'UAH';

  return (
    <section className="content">
      <div className="section-header">
        <span className="eyebrow">{t.yourCart}</span>
        <h1>{t.yourCart}</h1>
        <p>{t.cartHint}</p>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {cartLines.map((line) => (
            <article key={line.id} className="cart-item">
              <img
                src={getProductImageSrc(imageByVariantId.get(line.variant_id))}
                alt={line.product_name}
                className="cart-thumb"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                }}
              />
              <div className="cart-item-body">
                <div className="cart-item-header">
                  <h3 className="cart-item-title">{line.product_name}</h3>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeItem.mutate(line.id)}
                    disabled={removeItem.isPending}
                    aria-label={t.remove}
                    title={t.remove}
                  >
                    <Icon name="trash-can-1" />
                  </button>
                </div>
                <p className="cart-item-meta">
                  {t.size}: <strong>{line.size}</strong> ·{' '}
                  {formatPriceWithDiscount(line.unit_price, line.currency)}
                </p>
                <div className="cart-item-foot">
                  <div className="qty-control" role="group" aria-label={t.quantity}>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() =>
                        updateQty.mutate({
                          itemId: line.id,
                          quantity: Math.max(line.quantity - 1, 1),
                        })
                      }
                      disabled={updateQty.isPending || line.quantity <= 1}
                    >
                      <Icon name="minus" />
                    </button>
                    <span className="qty-value">{line.quantity}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() =>
                        updateQty.mutate({
                          itemId: line.id,
                          quantity: line.quantity + 1,
                        })
                      }
                      disabled={updateQty.isPending}
                    >
                      <Icon name="plus" />
                    </button>
                  </div>
                  <span className="price">{formatPriceWithDiscount(line.line_total, line.currency)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="summary-card">
          <h2 style={{ margin: 0, fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
            {t.yourSelection}
          </h2>
          <div className="summary-row">
            <span className="muted">{t.items}</span>
            <span>{t.itemsCount(totalQty)}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row large">
            <span>{t.total}</span>
            <span className="price">{formatPriceWithDiscount(cart.total, cartCurrency)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-block">
            <Icon name="checkmark-circle" />
            <span>{t.checkout}</span>
          </Link>
          <Link to="/" className="btn btn-ghost btn-block">
            <Icon name="arrow-left" />
            <span>{t.toCatalog}</span>
          </Link>
        </aside>
      </div>
    </section>
  );
};
