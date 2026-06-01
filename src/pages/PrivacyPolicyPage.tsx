import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { LegalSectionBlock } from '../components/LegalSectionBlock';
import { sectionAnchor, sectionLabel } from '../utils/legalSection';
import { privacyPolicyIntro, privacyPolicySections } from '../content/privacyPolicy';

const UPDATED = 'May 26, 2026';
const SUPPORT_EMAIL = 'dreamstepstore@gmail.com';

export const PrivacyPolicyPage = () => {
  return (
    <article className="privacy-page">
      <header className="privacy-header">
        <div className="privacy-header-badge" aria-hidden="true">
          <Icon name="shield-1" />
        </div>
        <div className="privacy-header-copy">
          <span className="privacy-eyebrow">Legal document</span>
          <h1>Privacy Policy</h1>
          <p className="privacy-lead">
            How Dream Step collects, uses, stores, and protects your personal information when you
            shop at our online merch store.
          </p>
          <p className="privacy-meta">Last updated: {UPDATED}</p>
        </div>
      </header>

      <div className="privacy-intro">
        {privacyPolicyIntro.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <div className="privacy-layout">
        <nav className="privacy-toc" aria-label="Privacy Policy contents">
          <h2 className="privacy-toc-heading">Contents</h2>
          <ol>
            {privacyPolicySections.map((section) => (
              <li key={sectionAnchor(section.title)}>
                <a href={`#${sectionAnchor(section.title)}`}>{sectionLabel(section.title)}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="privacy-sections">
          {privacyPolicySections.map((section) => (
            <LegalSectionBlock
              key={sectionAnchor(section.title)}
              section={section}
              className="privacy-section"
            />
          ))}
        </div>
      </div>

      <footer className="privacy-footer">
        <div className="privacy-footer-card">
          <h2>Privacy questions?</h2>
          <p>
            Contact Dream Step Support at{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
        </div>
        <div className="privacy-footer-links">
          <Link to="/terms-of-service">Terms of Service</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/" className="privacy-footer-shop">
            Back to shop
          </Link>
        </div>
      </footer>
    </article>
  );
};
