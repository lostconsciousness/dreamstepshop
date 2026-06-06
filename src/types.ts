export type Currency = 'usd' | 'eur';

export type ProductVariant = {
  id: number;
  size: string;
  sku: string;
  price: string;
  currency: string;
  stock: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  is_active: boolean;
  variants: ProductVariant[];
};

export type CartLine = {
  id: number;
  variant_id: number;
  product_name: string;
  size: string;
  sku: string;
  quantity: number;
  unit_price: string;
  line_total: string;
  currency: string;
};

export type Cart = {
  cart_token: string;
  lines: CartLine[];
  total: string;
  currency: string;
};

export type OrderLine = {
  product_name: string;
  size: string;
  sku: string;
  quantity: number;
  unit_price: string;
  line_total: string;
  currency: string;
};

export type ShippingAddress = {
  country: string;
  region: string | null;
  city: string;
  postal_code: string;
  address_line: string;
};

export type CheckoutPayload = {
  email: string;
  phone: string;
  recipient_name: string;
  shipping: {
    country: string;
    region: string | null;
    city: string;
    postal_code: string;
    address_line: string;
  };
  shipping_notes: string | null;
  telegram_username: string | null;
  telegram_user_id: number | null;
};

export type Order = {
  id: number;
  email: string;
  phone: string | null;
  recipient_name: string | null;
  shipping: ShippingAddress | null;
  shipping_notes: string | null;
  telegram_username: string | null;
  telegram_user_id: number | null;
  status: string;
  total: string;
  currency: string;
  lines: OrderLine[];
};

export type PaymentInit = {
  order_id: number;
  status: string;
  payment_url: string | null;
  invoice_uuid?: string | null;
  payment_token?: string | null;
  message: string;
};

export type PaymentoStatus = {
  configured: boolean;
  merchant_ping_ok?: boolean;
  initiate_payment?: string;
  ipn_url?: string;
  return_url?: string;
};

export type OrderListResponse = {
  orders: Order[];
};

export type ApiErrorResponse = {
  detail?: string | { msg?: string } | Array<{ msg?: string }>;
};
