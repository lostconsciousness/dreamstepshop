import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { LegalSectionBlock } from '../components/LegalSectionBlock';
import { sectionAnchor, sectionLabel } from '../utils/legalSection';
import { termsIntro, termsSections } from '../content/termsOfService';

const UPDATED = 'May 26, 2026';
const SUPPORT_EMAIL = 'dreamstepstore@gmail.com';

export const TermsOfServicePage = () => {
  return (
    <article className="terms-page">
      <header className="terms-header">
        <div className="terms-header-badge" aria-hidden="true">
          <Icon name="clipboard" />
        </div>
        <div className="terms-header-copy">
          <span className="terms-eyebrow">Legal document</span>
          <h1>Terms of Service</h1>
          <p className="terms-lead">
            The rules for using the Dream Step merch store, placing orders, making payments, and
            receiving deliveries.
          </p>
          <p className="terms-meta">Last updated: {UPDATED}</p>
        </div>
      </header>

      <div className="terms-intro">
        {termsIntro.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <div className="terms-layout">
        <nav className="terms-toc" aria-label="Terms of Service contents">
          <h2 className="terms-toc-heading">Contents</h2>
          <ol>
            {termsSections.map((section) => (
              <li key={sectionAnchor(section.title)}>
                <a href={`#${sectionAnchor(section.title)}`}>{sectionLabel(section.title)}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="terms-sections">
          {termsSections.map((section) => (
            <LegalSectionBlock
              key={sectionAnchor(section.title)}
              section={section}
              className="terms-section"
            />
          ))}
        </div>
      </div>

      <footer className="terms-footer">
        <div className="terms-footer-card">
          <h2>Need help with an order?</h2>
          <p>
            Contact Dream Step Support at{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
        </div>
        <div className="terms-footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/" className="terms-footer-shop">
            Back to shop
          </Link>
        </div>
      </footer>
    </article>
  );
};
