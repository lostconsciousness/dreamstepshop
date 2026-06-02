import { useI18n } from '../i18n';
import type { PaymentProvider } from '../payment';
import { PAYMENT_PROVIDER_OPTIONS } from '../paymentProviders';

type PaymentMethodPickerProps = {
  value: PaymentProvider | null;
  onChange: (provider: PaymentProvider) => void;
  disabled?: boolean;
};

export const PaymentMethodPicker = ({
  value,
  onChange,
  disabled = false,
}: PaymentMethodPickerProps) => {
  const { t } = useI18n();

  const labelFor = (id: PaymentProvider): string =>
    id === 'paymento' ? t.payWithPaymento : t.payWithCryptoCloud;

  const hintFor = (id: PaymentProvider): string =>
    id === 'paymento' ? t.paymentMethodPaymentoHint : t.paymentMethodCryptoCloudHint;

  return (
    <div className="payment-method-picker" role="radiogroup" aria-label={t.choosePaymentMethod}>
      {PAYMENT_PROVIDER_OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <label
            key={option.id}
            className={`payment-method-option${selected ? ' payment-method-option--selected' : ''}`}
          >
            <input
              type="radio"
              name="payment-provider"
              value={option.id}
              checked={selected}
              disabled={disabled}
              onChange={() => onChange(option.id)}
            />
            <span className="payment-method-option-body">
              <span className="payment-method-option-logo-wrap">
                <img
                  src={option.logo}
                  alt={option.logoAlt}
                  className="payment-method-option-logo"
                  loading="lazy"
                />
              </span>
              <span className="payment-method-option-text">
                <span className="payment-method-option-label">{labelFor(option.id)}</span>
                <span className="payment-method-option-desc">{hintFor(option.id)}</span>
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
};
