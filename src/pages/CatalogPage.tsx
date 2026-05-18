import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { useCurrency } from '../currency';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { CatalogSkeleton, StateBlock } from '../components/State';
import { useI18n } from '../i18n';
import { extractApiError } from '../utils';

export const CatalogPage = () => {
  const { t } = useI18n();
  const { currency } = useCurrency();
  const productsQuery = useQuery({
    queryKey: ['products', currency],
    queryFn: api.getProducts,
  });

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
          <ul className="hero-perks">
            <li><Icon name="delivery" /> {t.freeShipping}</li>
            <li><Icon name="shield-1" /> {t.authentic}</li>
            <li><Icon name="timer" /> {t.fastDelivery}</li>
          </ul>
        </div>
      </section>

      <section id="shop" className="section-header">
        <span className="eyebrow">{t.catalogTitle}</span>
        <h1>{t.catalogTitle}</h1>
        <p>{t.catalogSubtitle}</p>
      </section>

      {productsQuery.isPending ? (
        <CatalogSkeleton count={6} />
      ) : productsQuery.isError ? (
        <StateBlock
          emoji="⚠️"
          title={t.cannotLoadCatalog}
          message={extractApiError(productsQuery.error)}
        />
      ) : productsQuery.data.length === 0 ? (
        <StateBlock emoji="✨" title={t.emptyCatalog} message={t.productsSoon} />
      ) : (
        <div className="products-grid">
          {productsQuery.data.map((product, index) => (
            <ProductCard product={product} key={product.id} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
