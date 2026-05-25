import { API_BASE_URL } from './config';
import { resolveProductImageUrl } from './media';
import type { Language } from './i18n';
import type {
  ApiErrorResponse,
  Cart,
  CheckoutPayload,
  Order,
  PaymentInit,
  Product,
} from './types';
const CART_TOKEN_STORAGE_KEY = 'cart_token';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  withCartToken?: boolean;
  allowMissingCartToken?: boolean;
};

type RequestResult<T> = {
  data: T;
  nextCartToken: string | null;
};

export const getApiBaseUrl = (): string => API_BASE_URL;

export const getStoredCartToken = (): string | null => {
  try {
    return localStorage.getItem(CART_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setStoredCartToken = (token: string | null): void => {
  try {
    if (token) {
      localStorage.setItem(CART_TOKEN_STORAGE_KEY, token);
      window.dispatchEvent(new CustomEvent('cart-token-changed'));
      return;
    }
    localStorage.removeItem(CART_TOKEN_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('cart-token-changed'));
  } catch {
    // ignore
  }
};

const parseErrorMessage = (payload: ApiErrorResponse | null, status: number): string => {
  if (!payload) {
    return `Request failed (${status}).`;
  }
  const { detail } = payload;
  if (typeof detail === 'string') {
    return detail;
  }
  if (Array.isArray(detail)) {
    const text = detail
      .map((entry) => entry?.msg)
      .filter(Boolean)
      .join(', ');
    if (text) return text;
  }
  if (detail && typeof detail === 'object' && 'msg' in detail && typeof detail.msg === 'string') {
    return detail.msg;
  }
  return `Request failed (${status}).`;
};

async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<RequestResult<T>> {
  const { method = 'GET', body, withCartToken = false, allowMissingCartToken = false } = options;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (API_BASE_URL.includes('ngrok')) {
    headers['ngrok-skip-browser-warning'] = 'true';
  }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getStoredCartToken();
  if (withCartToken && token) {
    headers['X-Cart-Token'] = token;
  } else if (withCartToken && !allowMissingCartToken) {
    throw new Error('Cart not found. Add a product first.');
  }

  const url = `${API_BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      mode: 'cors',
    });
  } catch (networkError) {
    const message = networkError instanceof Error ? networkError.message : 'Network error';
    throw new Error(`Network error: ${message}. Is API running at ${API_BASE_URL}?`);
  }

  let responseCartToken = response.headers.get('X-Cart-Token');

  const status = response.status;
  const text = await response.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    throw new Error(parseErrorMessage(parsed as ApiErrorResponse | null, status));
  }

  if (
    !responseCartToken &&
    parsed &&
    typeof parsed === 'object' &&
    'cart_token' in (parsed as Record<string, unknown>) &&
    typeof (parsed as Record<string, unknown>).cart_token === 'string'
  ) {
    responseCartToken = (parsed as Record<string, unknown>).cart_token as string;
  }

  if (responseCartToken) {
    setStoredCartToken(responseCartToken);
  }

  return {
    data: (parsed ?? ({} as T)) as T,
    nextCartToken: responseCartToken,
  };
}

const normalizeCart = (cart: Cart): Cart => ({
  ...cart,
  lines: Array.isArray(cart?.lines) ? cart.lines : [],
  total: cart?.total ?? '0',
  currency: cart?.currency ?? 'USD',
});

const normalizeOrder = (order: Order): Order => ({
  ...order,
  lines: Array.isArray(order?.lines) ? order.lines : [],
  total: order?.total ?? '0',
  currency: order?.currency ?? 'USD',
  shipping: order?.shipping
    ? {
        country: order.shipping.country ?? '',
        city: order.shipping.city ?? '',
        postal_code: order.shipping.postal_code ?? '',
        address_line: order.shipping.address_line ?? '',
        region:
          order.shipping.region === undefined || order.shipping.region === ''
            ? null
            : order.shipping.region,
      }
    : null,
});

const normalizeProduct = (product: Product): Product => ({
  ...product,
  category: product?.category ?? null,
  is_active: product?.is_active !== false,
  image_url: resolveProductImageUrl(product?.image_url),
  variants: Array.isArray(product?.variants) ? product.variants : [],
});

export const api = {
  async health(): Promise<Record<string, string>> {
    const { data } = await requestJson<Record<string, string>>('/health');
    return data;
  },

  async getProducts(lang: Language): Promise<Product[]> {
    const { data } = await requestJson<Product[]>(
      `/api/products?lang=${encodeURIComponent(lang)}`,
    );
    return Array.isArray(data) ? data.map(normalizeProduct).filter((p) => p.is_active) : [];
  },

  async getProduct(id: number | string, lang: Language): Promise<Product> {
    const { data } = await requestJson<Product>(
      `/api/products/${id}?lang=${encodeURIComponent(lang)}`,
    );
    const product = normalizeProduct(data);
    if (!product.is_active) {
      throw new Error('Product is not available.');
    }
    return product;
  },

  async getCart(): Promise<Cart> {
    const { data } = await requestJson<Cart>('/api/cart', {
      withCartToken: true,
    });
    return normalizeCart(data);
  },

  async addCartItem(input: { variant_id: number; quantity: number }): Promise<Cart> {
    const payload = {
      variant_id: Number(input.variant_id),
      quantity: Number(input.quantity),
    };
    const { data } = await requestJson<Cart>('/api/cart/items', {
      method: 'POST',
      body: payload,
      withCartToken: true,
      allowMissingCartToken: true,
    });
    return normalizeCart(data);
  },

  async patchCartItem(itemId: number, input: { quantity: number }): Promise<Cart> {
    const { data } = await requestJson<Cart>(`/api/cart/items/${itemId}`, {
      method: 'PATCH',
      body: { quantity: Number(input.quantity) },
      withCartToken: true,
    });
    return normalizeCart(data);
  },

  async deleteCartItem(itemId: number): Promise<Cart> {
    const { data } = await requestJson<Cart>(`/api/cart/items/${itemId}`, {
      method: 'DELETE',
      withCartToken: true,
    });
    return normalizeCart(data);
  },

  async checkout(input: CheckoutPayload): Promise<Order> {
    const { data } = await requestJson<Order>('/api/checkout', {
      method: 'POST',
      body: input,
      withCartToken: true,
    });
    return normalizeOrder(data);
  },

  async getOrder(orderId: number | string): Promise<Order> {
    const { data } = await requestJson<Order>(`/api/orders/${orderId}`);
    return normalizeOrder(data);
  },

  async payOrder(orderId: number | string): Promise<PaymentInit> {
    const { data } = await requestJson<PaymentInit>(`/api/orders/${orderId}/payment`, {
      method: 'POST',
    });
    return data;
  },
};
