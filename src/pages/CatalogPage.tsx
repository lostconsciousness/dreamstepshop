import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { ProductCategory } from '../categories';
import { filterProductsByCategory, getCategoriesFromProducts } from '../categories';
import { CategoryFilter } from '../components/CategoryFilter';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { CatalogSkeleton, StateBlock } from '../components/State';
import { useI18n } from '../i18n';
import { extractApiError } from '../utils';

const SALE_COUNTDOWN_DEADLINE = new Date('2026-06-09T17:01:24+02:00').getTime();

const getSaleCountdown = () => {
  const remainingMs = Math.max(SALE_COUNTDOWN_DEADLINE - Date.now(), 0);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
};

const formatCountdownPart = (value: number) => String(value).padStart(2, '0');

export const CatalogPage = () => {
  const { t, language } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [saleCountdown, setSaleCountdown] = useState(getSaleCountdown);
  const productsQuery = useQuery({
    queryKey: ['products', language],
    queryFn: () => api.getProducts(language),
  });

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSaleCountdown(getSaleCountdown());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  const categories = useMemo(
    () => (productsQuery.data ? getCategoriesFromProducts(productsQuery.data) : []),
    [productsQuery.data],
  );

  const visibleProducts = useMemo(
    () =>
      productsQuery.data ? filterProductsByCategory(productsQuery.data, selectedCategory) : [],
    [productsQuery.data, selectedCategory],
  );

  return (
    <div className="content">
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-badge">{t.heroBadge}</span>
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-sub">{t.heroSubtitle}</p>
          <div className="hero-cta-row">
            <a href="#shop" className="btn btn-primary">
              <Icon name="bolt-1" />
              <span>{t.heroCta}</span>
            </a>
          </div>
          <div className="sale-countdown" aria-live="polite">
            <div className="sale-countdown-copy">
              <span>{t.saleCountdownLabel}</span>
              <strong>{t.saleCountdownTitle}</strong>
            </div>
            <div className="sale-countdown-timer">
              <span>
                <strong>{formatCountdownPart(saleCountdown.hours)}</strong>
                <small>{t.saleCountdownHours}</small>
              </span>
              <span>
                <strong>{formatCountdownPart(saleCountdown.minutes)}</strong>
                <small>{t.saleCountdownMinutes}</small>
              </span>
              <span>
                <strong>{formatCountdownPart(saleCountdown.seconds)}</strong>
                <small>{t.saleCountdownSeconds}</small>
              </span>
            </div>
          </div>
          <ul className="hero-perks">
            <li>
              <Icon name="shield-1" /> {t.authentic}
            </li>
            <li>
              <Icon name="timer" /> {t.fastDelivery}
            </li>
            <li>
              <Icon name="gift-1" /> {t.telegramCoinsReward}
            </li>
          </ul>
        </div>
      </section>

      <section id="shop" className="section-header">
        <span className="eyebrow">{t.catalogTitle}</span>
        <h1>{t.catalogTitle}</h1>
        <p>{t.catalogSubtitle}</p>
      </section>

      {productsQuery.isSuccess && categories.length > 0 ? (
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      ) : null}

      {productsQuery.isPending ? (
        <CatalogSkeleton count={6} />
      ) : productsQuery.isError ? (
        <StateBlock
          emoji="⚠️"
          title={t.cannotLoadCatalog}
          message={extractApiError(productsQuery.error)}
        />
      ) : visibleProducts.length === 0 ? (
        <StateBlock
          emoji="✨"
          title={selectedCategory ? t.emptyCategory : t.emptyCatalog}
          message={selectedCategory ? t.emptyCategoryHint : t.productsSoon}
          actions={
            selectedCategory ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setSelectedCategory(null)}
              >
                {t.categoryAll}
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="products-grid">
          {visibleProducts.map((product, index) => (
            <ProductCard product={product} key={product.id} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
