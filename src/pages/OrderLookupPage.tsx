import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Icon } from '../components/Icon';
import { useI18n } from '../i18n';
import { rememberOrderAccess } from '../orderAccess';
import { setStoredOrderEmail } from '../orderEmail';
import { getOrderStatusLabel } from '../orderStatus';
import { extractApiError } from '../utils';
import type { Order } from '../types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const OrderLookupPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [orderIdInput, setOrderIdInput] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [historyEmail, setHistoryEmail] = useState('');
  const [historyError, setHistoryError] = useState<string | null>(null);

  const lookupMutation = useMutation({
    mutationFn: ({ orderId, email: lookupEmail }: { orderId: number; email: string }) =>
      api.lookupOrder(orderId, lookupEmail),
    onSuccess: (order) => {
      setStoredOrderEmail(order.email);
      rememberOrderAccess(order.id);
      navigate(`/orders/${order.id}`);
    },
    onError: (error) => {
      setFormError(extractApiError(error));
    },
  });

  const historyMutation = useMutation({
    mutationFn: (lookupEmail: string) => api.getOrdersByEmail(lookupEmail),
    onSuccess: () => {
      setHistoryError(null);
    },
    onError: (error) => {
      setHistoryError(extractApiError(error));
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const orderId = Number(orderIdInput.trim());
    const emailTrim = email.trim();

    if (!Number.isFinite(orderId) || orderId <= 0) {
      setFormError(t.invalidOrderId);
      return;
    }
    if (!emailRegex.test(emailTrim)) {
      setFormError(t.invalidEmail);
      return;
    }

    setFormError(null);
    setStoredOrderEmail(emailTrim);
    lookupMutation.mutate({ orderId, email: emailTrim });
  };

  const handleHistorySubmit = (event: FormEvent) => {
    event.preventDefault();
    const emailTrim = historyEmail.trim();
    if (!emailRegex.test(emailTrim)) {
      setHistoryError(t.invalidEmail);
      return;
    }
    setHistoryError(null);
    setStoredOrderEmail(emailTrim);
    historyMutation.mutate(emailTrim);
  };

  const openOrder = (order: Order) => {
    setStoredOrderEmail(order.email);
    rememberOrderAccess(order.id);
    navigate(`/orders/${order.id}`);
  };

  return (
    <section className="content">
      <div className="section-header">
        <span className="eyebrow">{t.order}</span>
        <h1>{t.trackOrderTitle}</h1>
        <p>{t.trackOrderSubtitle}</p>
      </div>

      <div className="track-order-layout">
        <form className="checkout-card track-order-card" onSubmit={handleSubmit}>
          <h2 className="track-order-card-title">{t.findOrder}</h2>

          <label className="input-group">
            <span>{t.orderNumberLabel}</span>
            <input
              type="text"
              inputMode="numeric"
              value={orderIdInput}
              onChange={(event) => setOrderIdInput(event.target.value)}
              placeholder={t.orderNumberPlaceholder}
              autoComplete="off"
              required
            />
          </label>

          <label className="input-group">
            <span>{t.emailLabel}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t.emailPlaceholder}
              autoComplete="email"
              required
            />
          </label>

          <p className="input-hint">{t.trackOrderHint}</p>

          {formError ? <p className="toast error">{formError}</p> : null}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={lookupMutation.isPending}
          >
            <Icon name="search-1" />
            <span>{lookupMutation.isPending ? t.processing : t.findOrder}</span>
          </button>
        </form>

        <form className="checkout-card track-order-card" onSubmit={handleHistorySubmit}>
          <h2 className="track-order-card-title">{t.orderHistoryTitle}</h2>
          <p className="input-hint">{t.orderHistoryHint}</p>

          <label className="input-group">
            <span>{t.emailLabel}</span>
            <input
              type="email"
              value={historyEmail}
              onChange={(event) => setHistoryEmail(event.target.value)}
              placeholder={t.emailPlaceholder}
              autoComplete="email"
              required
            />
          </label>

          {historyError ? <p className="toast error">{historyError}</p> : null}

          <button
            type="submit"
            className="btn btn-ghost btn-block"
            disabled={historyMutation.isPending}
          >
            <Icon name="list-1" />
            <span>{historyMutation.isPending ? t.processing : t.loadOrderHistory}</span>
          </button>

          {historyMutation.isSuccess ? (
            <div className="order-history-list">
              {historyMutation.data.length === 0 ? (
                <p className="input-hint">{t.orderHistoryEmpty}</p>
              ) : (
                historyMutation.data.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    className="order-history-item"
                    onClick={() => openOrder(order)}
                  >
                    <span className="order-history-item-id">
                      {t.order} #{order.id}
                    </span>
                    <span className="order-history-item-status">
                      {getOrderStatusLabel(order.status, t)}
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </form>
      </div>

      <Link to="/" className="btn btn-ghost" style={{ marginTop: '1rem' }}>
        <Icon name="arrow-left" />
        <span>{t.toCatalog}</span>
      </Link>
    </section>
  );
};
