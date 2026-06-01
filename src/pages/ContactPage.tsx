import { Link } from 'react-router-dom';

const SUPPORT_EMAIL = 'dreamstepstore@gmail.com';

export const ContactPage = () => {
  return (
    <article className="legal-doc">
      <header className="section-header">
        <span className="eyebrow">Support</span>
        <h1>Contact Us</h1>
        <p className="legal-updated">Customer support for orders, delivery, and account questions.</p>
      </header>

      <div className="legal-body">
        <section className="legal-section">
          <h2>Dream Step Support</h2>
          <p>
            Need help with an order, payment, shipping, returns, or privacy requests? Our support team is
            available by email.
          </p>
          <p>
            Email:{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="legal-link">
              {SUPPORT_EMAIL}
            </a>
          </p>
          <p>We usually respond within 1–2 business days.</p>
        </section>

        <section className="legal-section">
          <h2>What to include in your message</h2>
          <ul>
            <li>Your order number, if available</li>
            <li>The email address used at checkout</li>
            <li>A clear description of your question or issue</li>
            <li>Photos for damaged or incorrect items, if applicable</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Policies</h2>
          <p>
            For details on how we handle personal data, see our{' '}
            <Link to="/privacy-policy" className="legal-link">
              Privacy Policy
            </Link>
            . For store rules and purchase conditions, see our{' '}
            <Link to="/terms-of-service" className="legal-link">
              Terms of Service
            </Link>
            .
          </p>
        </section>
      </div>

      <p className="legal-back">
        <Link to="/">← Back to shop</Link>
      </p>
    </article>
  );
};
