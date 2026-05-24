const INVOICE_CREATE_URL = 'https://api.cryptocloud.plus/v2/invoice/create';

const SUPPORTED_CURRENCIES = new Set([
  'USD',
  'EUR',
  'UAH',
  'RUB',
  'GBP',
  'UZS',
  'KGS',
  'KZT',
  'AMD',
  'AZN',
  'BYN',
  'AUD',
  'TRY',
  'AED',
  'CAD',
  'CNY',
  'HKD',
  'IDR',
  'INR',
  'JPY',
  'PHP',
  'SGD',
  'THB',
  'VND',
  'MYR',
]);

export type CryptoCloudConfig = {
  apiKey: string;
  shopId: string;
};

type CreateInvoiceInput = {
  amount: number;
  currency: string;
  orderId: string;
  email?: string;
};

type CreateInvoiceResponse = {
  status?: string;
  result?: {
    link?: string;
    uuid?: string;
  };
  error?: string;
  message?: string;
};

export const getCryptoCloudConfig = (): CryptoCloudConfig | null => {
  const apiKey = import.meta.env.VITE_CRYPTOCLOUD_API_KEY?.trim();
  const shopId = import.meta.env.VITE_CRYPTOCLOUD_SHOP_ID?.trim();
  if (!apiKey || !shopId) {
    return null;
  }
  return { apiKey, shopId };
};

export const isCryptoCloudEnabled = (): boolean => getCryptoCloudConfig() !== null;

export const mapOrderCurrencyToCryptoCloud = (currency: string): string => {
  const upper = currency.trim().toUpperCase();
  if (SUPPORTED_CURRENCIES.has(upper)) {
    return upper;
  }
  return 'USD';
};

export async function createCryptoCloudInvoice(input: CreateInvoiceInput): Promise<string> {
  const config = getCryptoCloudConfig();
  if (!config) {
    throw new Error('CryptoCloud is not configured. Set VITE_CRYPTOCLOUD_API_KEY and VITE_CRYPTOCLOUD_SHOP_ID.');
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('Invalid payment amount.');
  }

  const body: Record<string, string | number> = {
    shop_id: config.shopId,
    amount: input.amount,
    currency: mapOrderCurrencyToCryptoCloud(input.currency),
    order_id: input.orderId,
  };

  const email = input.email?.trim();
  if (email) {
    body.email = email;
  }

  let response: Response;
  try {
    response = await fetch(INVOICE_CREATE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Token ${config.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (networkError) {
    const message = networkError instanceof Error ? networkError.message : 'Network error';
    throw new Error(`CryptoCloud request failed: ${message}`);
  }

  const text = await response.text();
  let parsed: CreateInvoiceResponse | null = null;
  if (text) {
    try {
      parsed = JSON.parse(text) as CreateInvoiceResponse;
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    const message =
      parsed?.message || parsed?.error || text || `CryptoCloud responded with HTTP ${response.status}`;
    throw new Error(message);
  }

  const link = parsed?.result?.link;
  if (!link) {
    throw new Error('CryptoCloud did not return a payment link.');
  }

  return link;
}
