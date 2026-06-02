import { FormEvent, useState } from 'react';
import { useI18n } from '../i18n';
import { setStoredOrderEmail } from '../orderEmail';

type OrderEmailPromptProps = {
  onSubmit: (email: string) => void;
  initialEmail?: string | null;
};

export const OrderEmailPrompt = ({ onSubmit, initialEmail }: OrderEmailPromptProps) => {
  const { t } = useI18n();
  const [email, setEmail] = useState(initialEmail ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(t.invalidEmail);
      return;
    }
    setError(null);
    setStoredOrderEmail(trimmed);
    onSubmit(trimmed);
  };

  return (
    <form className="order-email-prompt" onSubmit={handleSubmit}>
      <p className="input-hint">{t.orderEmailRequiredHint}</p>
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
      {error ? <p className="toast error">{error}</p> : null}
      <button type="submit" className="btn btn-primary btn-block">
        {t.continueWithEmail}
      </button>
    </form>
  );
};
