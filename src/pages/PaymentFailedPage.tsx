import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { StateBlock } from '../components/State';
import { parseOrderIdFromPaymentReturn } from '../cryptocloudUrls';
import { useI18n } from '../i18n';

export const PaymentFailedPage = () => {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const orderId = parseOrderIdFromPaymentReturn(searchParams);

  return (
    <StateBlock
      emoji="⚠️"
      title={t.paymentFailedTitle}
      message={t.paymentReturnFail}
      actions={
        <>
          {orderId ? (
            <Link to={`/orders/${orderId}`} className="btn btn-primary">
              <Icon name="credit-card-1" />
              <span>{t.tryPayAgain}</span>
            </Link>
          ) : null}
          <Link to="/" className="btn btn-ghost">
            <Icon name="arrow-left" />
            <span>{t.toCatalog}</span>
          </Link>
        </>
      }
    />
  );
};
