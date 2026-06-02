import { Icon } from './Icon';
import { useI18n } from '../i18n';
import type { PaymentProvider } from '../payment';
import type { Order } from '../types';

type PaymentMethodButtonsProps = {
  order: Order;
  paymentoAvailable: boolean;
  disabled?: boolean;
  isPaying: boolean;
  payingProvider: PaymentProvider | null;
  onPay: (order: Order, provider: PaymentProvider) => void;
};

export const PaymentMethodButtons = ({
  order,
  paymentoAvailable,
  disabled = false,
  isPaying,
  payingProvider,
  onPay,
}: PaymentMethodButtonsProps) => {
  const { t } = useI18n();

  return (
    <div className="payment-methods">
      {paymentoAvailable ? (
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => onPay(order, 'paymento')}
          disabled={disabled || isPaying}
        >
          <Icon name="credit-card-1" />
          <span>
            {isPaying && payingProvider === 'paymento' ? t.redirectingToPay : t.payWithPaymento}
          </span>
        </button>
      ) : null}
      <button
        type="button"
        className={paymentoAvailable ? 'btn btn-ghost btn-block' : 'btn btn-primary btn-block'}
        onClick={() => onPay(order, 'cryptocloud')}
        disabled={disabled || isPaying}
      >
        <Icon name="credit-card-1" />
        <span>
          {isPaying && payingProvider === 'cryptocloud' ? t.redirectingToPay : t.payWithCryptoCloud}
        </span>
      </button>
    </div>
  );
};
