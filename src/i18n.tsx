import { createContext, useContext, useEffect } from 'react';

export type Language = 'en';

type Messages = {
  navCatalog: string;
  navCart: string;
  navCheckout: string;
  brandSubtitle: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  loadingProducts: string;
  pleaseWait: string;
  cannotLoadCatalog: string;
  emptyCatalog: string;
  productsSoon: string;
  catalogTitle: string;
  catalogSubtitle: string;
  categoryAll: string;
  categoryFilterLabel: string;
  emptyCategory: string;
  emptyCategoryHint: string;
  categoryLabel: (category: string) => string;
  priceOnRequest: string;
  viewProduct: string;
  invalidProductId: string;
  loadingProduct: string;
  cannotLoadProduct: string;
  noVariants: string;
  qtyPositive: string;
  backToCatalog: string;
  chooseSize: string;
  outOfStockShort: string;
  quantity: string;
  addToCart: string;
  adding: string;
  addedToCart: string;
  emptyCart: string;
  addFromCatalog: string;
  loadingCart: string;
  cannotLoadCart: string;
  chooseFromCatalog: string;
  yourCart: string;
  cartHint: string;
  size: string;
  price: string;
  remove: string;
  total: string;
  checkout: string;
  noActiveCart: string;
  addBeforeCheckout: string;
  orderCreated: string;
  viewOrder: string;
  loadingCartData: string;
  cannotGetCart: string;
  addItemToCheckout: string;
  checkoutTitle: string;
  checkoutSubtitle: string;
  payNow: string;
  confirm: string;
  confirmAndPay: string;
  confirming: string;
  confirmingAndPaying: string;
  checkoutRedirectingMessage: (orderId: number) => string;
  invalidEmail: string;
  invalidOrderId: string;
  loadingOrder: string;
  cannotLoadOrder: string;
  order: string;
  status: string;
  positions: string;
  processing: string;
  payCrypto: string;
  redirectingToPay: string;
  paymentSuccessTitle: string;
  paymentFailedTitle: string;
  paymentReturnSuccess: string;
  paymentReturnFail: string;
  tryPayAgain: string;
  toCatalog: string;
  paymentDone: string;
  notFound: string;
  notFoundHint: string;
  toHome: string;
  genericErrorTitle: string;
  genericErrorMessage: string;
  languageLabel: string;
  currencyLabel: string;
  items: string;
  authentic: string;
  fastDelivery: string;
  yourSelection: string;
  emailLabel: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  phoneLabel: string;
  telegramLabel: string;
  telegramCoinsReward: string;
  telegramCoinsHint: string;
  invalidTelegram: string;
  recipientNameLabel: string;
  sectionContact: string;
  sectionShipping: string;
  countryLabel: string;
  regionLabel: string;
  cityLabel: string;
  postalLabel: string;
  addressLineLabel: string;
  shippingNotesLabel: string;
  notesHeading: string;
  invalidPhone: string;
  fillRequired: string;
  placeholders: {
    country: string;
    region: string;
    city: string;
    postal: string;
    address: string;
    recipient: string;
    notes: string;
    telegram: string;
  };
  orderCreatedMessage: (id: number, total: string) => string;
  itemsCount: (n: number) => string;
};

const messages: Record<Language, Messages> = {
  en: {
    navCatalog: 'Shop',
    navCart: 'Cart',
    navCheckout: 'Checkout',
    brandSubtitle: 'Official Dream Step merch',
    heroBadge: 'NEW DROP',
    heroTitle: 'Wear the dream.',
    heroSubtitle: 'Official Dream Step merch — premium streetwear made for the community.',
    heroCta: 'Shop the drop',
    loadingProducts: 'Loading products...',
    pleaseWait: 'Hang tight.',
    cannotLoadCatalog: 'Could not load catalog',
    emptyCatalog: 'Catalog is empty',
    productsSoon: 'New drops coming soon.',
    catalogTitle: 'Dream Step Merch',
    catalogSubtitle: 'Limited drops. Premium quality. For dreamers only.',
    categoryAll: 'All',
    categoryFilterLabel: 'Categories',
    emptyCategory: 'No items in this category',
    emptyCategoryHint: 'Pick another category or browse the full catalog.',
    categoryLabel: (category) => {
      const labels: Record<string, string> = {
        Одежда: 'Clothing',
        Обувь: 'Footwear',
        Аксессуары: 'Accessories',
        Посуда: 'Drinkware',
        Apparel: 'Clothing',
        Shoes: 'Footwear',
        Accessories: 'Accessories',
        Drinkware: 'Drinkware',
      };
      return labels[category] ?? category;
    },
    priceOnRequest: 'On request',
    viewProduct: 'View',
    invalidProductId: 'Invalid product id',
    loadingProduct: 'Loading product...',
    cannotLoadProduct: 'Could not load product',
    noVariants: 'No available variants',
    qtyPositive: 'Quantity must be greater than 0.',
    backToCatalog: 'Back to shop',
    chooseSize: 'Select size',
    outOfStockShort: 'Sold out',
    quantity: 'Quantity',
    addToCart: 'Add to cart',
    adding: 'Adding...',
    addedToCart: 'Added to cart',
    emptyCart: 'Your cart is empty',
    addFromCatalog: 'Time to grab some fresh merch.',
    loadingCart: 'Loading cart...',
    cannotLoadCart: 'Could not load cart',
    chooseFromCatalog: 'Browse the drop and pick your style.',
    yourCart: 'Your cart',
    cartHint: 'Review your items before checkout.',
    size: 'Size',
    price: 'Price',
    remove: 'Remove',
    total: 'Total',
    checkout: 'Checkout',
    noActiveCart: 'No active cart',
    addBeforeCheckout: 'Add items before checkout.',
    orderCreated: 'Order confirmed',
    viewOrder: 'View order',
    loadingCartData: 'Loading cart data...',
    cannotGetCart: 'Could not fetch cart',
    addItemToCheckout: 'Add at least one item to continue.',
    checkoutTitle: 'Checkout',
    checkoutSubtitle: 'Enter your contact details and full delivery address for shipping.',
    phoneLabel: 'Phone',
    telegramLabel: 'Telegram username (optional)',
    telegramCoinsReward: 'Add Telegram at checkout — get 70,000 coins',
    telegramCoinsHint: 'Enter your @username to receive 70,000 Dream Step coins as a reward.',
    invalidTelegram: 'Telegram username must be 64 characters or less.',
    recipientNameLabel: 'Recipient full name',
    sectionContact: 'Contact',
    sectionShipping: 'Shipping address',
    countryLabel: 'Country',
    regionLabel: 'Region / state',
    cityLabel: 'City',
    postalLabel: 'Postal code',
    addressLineLabel: 'Street, building, apartment',
    shippingNotesLabel: 'Delivery notes (optional)',
    notesHeading: 'Notes',
    invalidPhone: 'Enter a valid phone number (at least 5 characters).',
    fillRequired: 'Please fill in all required fields.',
    payNow: 'To pay',
    confirm: 'Confirm order',
    confirmAndPay: 'Place order and pay',
    confirming: 'Confirming...',
    confirmingAndPaying: 'Creating order, redirecting to payment…',
    checkoutRedirectingMessage: (orderId) =>
      `Order #${orderId} created. Opening CryptoCloud payment page…`,
    invalidEmail: 'Please enter a valid email.',
    invalidOrderId: 'Invalid order id',
    loadingOrder: 'Loading order...',
    cannotLoadOrder: 'Could not load order',
    order: 'Order',
    status: 'Status',
    positions: 'Items',
    processing: 'Processing...',
    payCrypto: 'Pay with crypto',
    redirectingToPay: 'Redirecting to payment…',
    paymentSuccessTitle: 'Payment successful',
    paymentFailedTitle: 'Payment not completed',
    paymentReturnSuccess:
      'Thank you! Your payment was received. Order status will update after CryptoCloud confirms the transaction.',
    paymentReturnFail: 'Payment was cancelled or failed. You can try again from the order page.',
    tryPayAgain: 'Try again',
    toCatalog: 'Continue shopping',
    paymentDone: 'Payment confirmed.',
    notFound: 'Page not found',
    notFoundHint: 'Looks like this drop is gone.',
    toHome: 'Home',
    genericErrorTitle: 'Something went wrong',
    genericErrorMessage: 'An unexpected error happened. Refresh the page or return to shop.',
    languageLabel: 'Language',
    currencyLabel: 'Currency',
    items: 'items',
    authentic: '100% authentic merch',
    fastDelivery: 'Worldwide shipping',
    yourSelection: 'Your selection',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    phonePlaceholder: '+1 234 567 8900',
    placeholders: {
      country: 'e.g. Germany',
      region: 'e.g. Berlin',
      city: 'e.g. Berlin',
      postal: 'e.g. 10115',
      address: 'Street, house, apt, entrance, floor',
      recipient: 'First and last name',
      notes: 'Courier instructions, preferred time…',
      telegram: '@yourusername',
    },
    itemsCount: (n) => (n === 1 ? '1 item' : `${n} items`),
    orderCreatedMessage: (id, total) => `Order #${id} confirmed. Total: ${total}.`,
  },
};

type I18nContextValue = {
  language: Language;
  t: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const language: Language = 'en';

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: I18nContextValue = {
    language,
    t: messages[language],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
};
