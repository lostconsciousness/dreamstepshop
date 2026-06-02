import { Link, NavLink, Outlet } from 'react-router-dom';
import { useCartSummary } from '../hooks/useCartSummary';
import { useI18n } from '../i18n';
import { Icon } from './Icon';
import logoImage from '../assets/logo.png';

export const Layout = () => {
  const { t } = useI18n();
  const { totalItems } = useCartSummary();

  return (
    <div className="page-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <img src={logoImage} alt="Dream Step" className="brand-logo" />
          <span className="brand-text">
            <strong>Dream Step Merch</strong>
            <small>{t.brandSubtitle}</small>
          </span>
        </Link>

        <nav className="topnav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Icon name="home-1" />
            <span>{t.navCatalog}</span>
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Icon name="cart-1" />
            <span>{t.navCart}</span>
            {totalItems > 0 ? <span className="cart-badge">{totalItems}</span> : null}
          </NavLink>
          <NavLink to="/checkout" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Icon name="checkmark-circle" />
            <span>{t.navCheckout}</span>
          </NavLink>
        </nav>

      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p className="site-footer-copy">© {new Date().getFullYear()} Dream Step Merch</p>
        <nav className="site-footer-nav" aria-label="Legal and support">
          <Link to="/contact">{t.footerContact}</Link>
          <Link to="/orders/track">{t.trackOrder}</Link>
          <Link to="/privacy-policy">{t.footerPrivacy}</Link>
          <Link to="/terms-of-service">{t.footerTerms}</Link>
        </nav>
      </footer>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'bottom-link active' : 'bottom-link')}>
          <Icon name="home-1" className="bottom-ico" />
          <span>{t.navCatalog}</span>
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => (isActive ? 'bottom-link active' : 'bottom-link')}>
          <span className="bottom-icon-wrap">
            <Icon name="cart-1" className="bottom-ico" />
            {totalItems > 0 ? <span className="cart-badge cart-badge--floating">{totalItems}</span> : null}
          </span>
          <span>{t.navCart}</span>
        </NavLink>
        <NavLink to="/checkout" className={({ isActive }) => (isActive ? 'bottom-link active' : 'bottom-link')}>
          <Icon name="checkmark-circle" className="bottom-ico" />
          <span>{t.navCheckout}</span>
        </NavLink>
      </nav>
    </div>
  );
};
