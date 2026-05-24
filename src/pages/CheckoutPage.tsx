import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api, getStoredCartToken, setStoredCartToken } from '../api';
import { useCurrency } from '../currency';
import { Icon } from '../components/Icon';
import { StateBlock } from '../components/State';
import { useCryptoCloudPayment } from '../hooks/useCryptoCloudPayment';
import { useI18n } from '../i18n';
import type { CheckoutPayload } from '../types';
import { extractApiError, formatPrice } from '../utils';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CheckoutPage = () => {
  const { t } = useI18n();
  const { currency } = useCurrency();
  const queryClient = useQueryClient();
  const hasToken = Boolean(getStoredCartToken());
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [shippingNotes, setShippingNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const cryptoPay = useCryptoCloudPayment();

  const cartQuery = useQuery({
    queryKey: ['cart', currency],
    queryFn: api.getCart,
    enabled: hasToken,
  });

  const checkoutMutation = useMutation({
    mutationFn: api.checkout,
    onSuccess: (order) => {
      setFormError(null);
      setStoredCartToken(null);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.setQueryData(['order', order.id, currency], order);
    },
    onError: (error) => {
      setFormError(extractApiError(error));
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const phoneTrim = phone.trim();
    const recipientTrim = recipientName.trim();
    const countryTrim = country.trim();
    const cityTrim = city.trim();
    const postalTrim = postalCode.trim();
    const addressTrim = addressLine.trim();

    if (!emailRegex.test(email.trim())) {
      setFormError(t.invalidEmail);
      return;
    }
    if (phoneTrim.length < 5) {
      setFormError(t.invalidPhone);
      return;
    }
    if (!recipientTrim || !countryTrim || !cityTrim || !postalTrim || !addressTrim) {
      setFormError(t.fillRequired);
      return;
    }

    const regionTrim = region.trim();
    const notesTrim = shippingNotes.trim();

    const payload: CheckoutPayload = {
      email: email.trim(),
      phone: phoneTrim,
      recipient_name: recipientTrim,
      shipping: {
        country: countryTrim,
        region: regionTrim ? regionTrim : null,
        city: cityTrim,
        postal_code: postalTrim,
        address_line: addressTrim,
      },
      shipping_notes: notesTrim ? notesTrim : null,
    };

    checkoutMutation.mutate(payload);
  };

  if (!hasToken) {
    return (
      <StateBlock
        emoji="🛍"
        title={t.noActiveCart}
        message={t.addBeforeCheckout}
        actions={
          <Link to="/" className="btn btn-primary">
            {t.toCatalog}
          </Link>
        }
      />
    );
  }

  if (checkoutMutation.isSuccess) {
    const order = checkoutMutation.data;
    return (
      <StateBlock
        emoji="✅"
        title={t.orderCreated}
        message={t.orderCreatedMessage(order.id, formatPrice(order.total, order.currency))}
        actions={
          <>
            {cryptoPay.isEnabled ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => cryptoPay.pay(order)}
                disabled={cryptoPay.isPaying}
              >
                <Icon name="credit-card-1" />
                <span>{cryptoPay.isPaying ? t.redirectingToPay : t.payCrypto}</span>
              </button>
            ) : null}
            <Link to={`/orders/${order.id}`} className="btn btn-ghost">
              {t.viewOrder}
            </Link>
          </>
        }
      />
    );
  }

  if (cartQuery.isPending) {
    return <StateBlock title={t.loadingCartData} />;
  }

  if (cartQuery.isError) {
    return (
      <StateBlock
        emoji="⚠️"
        title={t.cannotGetCart}
        message={extractApiError(cartQuery.error)}
      />
    );
  }

  const cart = cartQuery.data;
  if (!cart || cart.lines.length === 0) {
    return (
      <StateBlock
        emoji="🛒"
        title={t.emptyCart}
        message={t.addItemToCheckout}
        actions={
          <Link to="/" className="btn btn-primary">
            {t.toCatalog}
          </Link>
        }
      />
    );
  }

  const totalQty = cart.lines.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);
  const cartCurrency = cart.currency || cart.lines[0]?.currency || 'UAH';

  return (
    <section className="content">
      <div className="section-header">
        <span className="eyebrow">{t.checkout}</span>
        <h1>{t.checkoutTitle}</h1>
        <p>{t.checkoutSubtitle}</p>
      </div>

      <div className="checkout-grid">
        <form className="checkout-card" onSubmit={handleSubmit}>
          <h2>{t.checkout}</h2>

          <div className="form-section">
            <h3 className="form-section-title">{t.sectionContact}</h3>
            <label className="input-group">
              <span>{t.emailLabel}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t.emailPlaceholder}
                required
                autoComplete="email"
              />
            </label>
            <label className="input-group">
              <span>{t.phoneLabel}</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={t.phonePlaceholder}
                autoComplete="tel"
                required
                minLength={5}
              />
            </label>
            <label className="input-group">
              <span>{t.recipientNameLabel}</span>
              <input
                type="text"
                value={recipientName}
                onChange={(event) => setRecipientName(event.target.value)}
                placeholder={t.placeholders.recipient}
                autoComplete="name"
                required
              />
            </label>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">{t.sectionShipping}</h3>
            <div className="address-grid">
              <label className="input-group">
                <span>{t.countryLabel}</span>
                <input
                  type="text"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  placeholder={t.placeholders.country}
                  autoComplete="country-name"
                  required
                />
              </label>
              <label className="input-group">
                <span>{t.regionLabel}</span>
                <input
                  type="text"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  placeholder={t.placeholders.region}
                  autoComplete="address-level1"
                />
              </label>
              <label className="input-group">
                <span>{t.cityLabel}</span>
                <input
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder={t.placeholders.city}
                  autoComplete="address-level2"
                  required
                />
              </label>
              <label className="input-group">
                <span>{t.postalLabel}</span>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(event) => setPostalCode(event.target.value)}
                  placeholder={t.placeholders.postal}
                  autoComplete="postal-code"
                  required
                />
              </label>
              <label className="input-group address-full">
                <span>{t.addressLineLabel}</span>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(event) => setAddressLine(event.target.value)}
                  placeholder={t.placeholders.address}
                  autoComplete="street-address"
                  required
                />
              </label>
            </div>
          </div>

          <label className="input-group">
            <span>{t.shippingNotesLabel}</span>
            <textarea
              value={shippingNotes}
              onChange={(event) => setShippingNotes(event.target.value)}
              placeholder={t.placeholders.notes}
              rows={3}
              autoComplete="off"
            />
          </label>

          {formError ? <p className="toast error">{formError}</p> : null}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={checkoutMutation.isPending}
          >
            <Icon name="lock-alt-1" />
            <span>
              {checkoutMutation.isPending
                ? t.confirming
                : `${t.confirm} · ${formatPrice(cart.total, cartCurrency)}`}
            </span>
          </button>
        </form>

        <aside className="summary-card">
          <h2 style={{ margin: 0, fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
            {t.yourSelection}
          </h2>
          <div className="order-lines">
            {cart.lines.map((line) => (
              <div key={line.id} className="order-line">
                <div>
                  <p className="order-line-name">{line.product_name}</p>
                  <p className="order-line-meta">
                    {t.size}: <strong>{line.size}</strong> · ×{line.quantity}
                  </p>
                </div>
                <p className="order-line-price">{formatPrice(line.line_total, line.currency)}</p>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-row">
            <span className="muted">{t.items}</span>
            <span>{t.itemsCount(totalQty)}</span>
          </div>
          <div className="summary-row large">
            <span>{t.payNow}</span>
            <span className="price">{formatPrice(cart.total, cartCurrency)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
};
