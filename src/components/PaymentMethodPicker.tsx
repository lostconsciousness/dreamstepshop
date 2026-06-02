import { Icon } from './Icon';
import { useI18n } from '../i18n';
import type { PaymentProvider } from '../payment';

type PaymentMethodPickerProps = {
  value: PaymentProvider | null;
  onChange: (provider: PaymentProvider) => void;
  paymentoAvailable: boolean;
  disabled?: boolean;
};

export const PaymentMethodPicker = ({
  value,
  onChange,
  paymentoAvailable,
  disabled = false,
}: PaymentMethodPickerProps) => {
  const { t } = useI18n();

  const options: { id: PaymentProvider; label: string; description: string }[] = [
    ...(paymentoAvailable
      ? [
          {
            id: 'paymento' as const,
            label: t.payWithPaymento,
            description: t.paymentMethodPaymentoHint,
          },
        ]
      : []),
    {
      id: 'cryptocloud',
      label: t.payWithCryptoCloud,
      description: t.paymentMethodCryptoCloudHint,
    },
  ];

  return (
    <div className="payment-method-picker" role="radiogroup" aria-label={t.choosePaymentMethod}>
      {options.map((option) => {
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
              <span className="payment-method-option-label">
                <Icon name="credit-card-1" />
                <span>{option.label}</span>
              </span>
              <span className="payment-method-option-desc">{option.description}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
};
