import type { PaymentProvider } from './payment';
import cryptocloudLogo from './assets/payments/cryptocloud.png';
import paymentoLogo from './assets/payments/paymento.png';

export type PaymentProviderOption = {
  id: PaymentProvider;
  logo: string;
  logoAlt: string;
};

export const PAYMENT_PROVIDER_OPTIONS: PaymentProviderOption[] = [
  {
    id: 'paymento',
    logo: paymentoLogo,
    logoAlt: 'Paymento',
  },
  {
    id: 'cryptocloud',
    logo: cryptocloudLogo,
    logoAlt: 'CryptoCloud',
  },
];

export const DEFAULT_PAYMENT_PROVIDER: PaymentProvider = 'paymento';
