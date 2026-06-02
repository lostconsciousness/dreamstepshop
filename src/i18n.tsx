import { createContext, useContext, useEffect } from 'react';

export type Language = 'en';

export type Messages = {
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
  productAbout: string;
  productDetails: string;
  productSku: string;
  productAvailableSizes: string;
  productDescriptionFallback: string;
  officialMerch: string;
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
  orderCreatedChoosePayment: (orderId: number, total: string) => string;
  invalidEmail: string;
  invalidOrderId: string;
  loadingOrder: string;
  cannotLoadOrder: string;
  order: string;
  status: string;
  positions: string;
  processing: string;
  payCrypto: string;
  payWithPaymento: string;
  payWithCryptoCloud: string;
  choosePaymentMethod: string;
  confirmAndContinueToPayment: string;
  paymentPageEyebrow: string;
  paymentPageTitle: (orderId: number) => string;
  paymentPageSubtitle: string;
  reviewOrderDetails: string;
  proceedToPayment: string;
  amountDue: string;
  paymentAmountHint: string;
  paymentMethodPaymentoHint: string;
  paymentMethodCryptoCloudHint: string;
  trackOrder: string;
  trackOrderTitle: string;
  trackOrderSubtitle: string;
  trackOrderHint: string;
  orderNumberLabel: string;
  orderNumberPlaceholder: string;
  findOrder: string;
  orderConfirmationTitle: string;
  orderConfirmationMessage: string;
  orderStatusTitle: (orderId: number) => string;
  orderPendingPaymentMessage: string;
  completePayment: string;
  orderStatusPaid: string;
  orderStatusPending: string;
  orderStatusProcessing: string;
  orderStatusShipped: string;
  orderStatusDelivered: string;
  orderStatusCancelled: string;
  paymentReturnNoOrderId: string;
  paymentEmailRequiredMessage: string;
  orderEmailRequiredTitle: string;
  orderEmailRequiredSubtitle: string;
  orderEmailRequiredHint: string;
  continueWithEmail: string;
  orderHistoryTitle: string;
  orderHistoryHint: string;
  loadOrderHistory: string;
  orderHistoryEmpty: string;
  redirectingToPay: string;
  paymentSuccessTitle: string;
  paymentFailedTitle: string;
  paymentReturnSuccess: string;
  paymentReturnFail: string;
  paymentConfirmingTitle: string;
  paymentConfirmingMessage: (orderId: number) => string;
  paymentConfirmingTimeout: string;
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
  footerContact: string;
  footerPrivacy: string;
  footerTerms: string;
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
    productAbout: 'About this item',
    productDetails: 'Product details',
    productSku: 'SKU',
    productAvailableSizes: 'Available sizes',
    productDescriptionFallback:
      'Official Dream Step merchandise. Premium apparel and accessories from the Dream Step collection.',
    officialMerch: 'Official Dream Step merch',
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
    footerContact: 'Contact',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Service',
    payNow: 'To pay',
    confirm: 'Confirm order',
    confirmAndPay: 'Place order and pay',
    confirming: 'Confirming...',
    confirmingAndPaying: 'Creating order…',
    checkoutRedirectingMessage: (orderId) =>
      `Order #${orderId} created. Opening payment page…`,
    orderCreatedChoosePayment: (orderId, total) =>
      `Order #${orderId} confirmed. Total: ${total}. Choose a payment method:`,
    invalidEmail: 'Please enter a valid email.',
    invalidOrderId: 'Invalid order id',
    loadingOrder: 'Loading order...',
    cannotLoadOrder: 'Could not load order',
    order: 'Order',
    status: 'Status',
    positions: 'Items',
    processing: 'Processing...',
    payCrypto: 'Pay with crypto',
    payWithPaymento: 'Pay with crypto (Paymento)',
    payWithCryptoCloud: 'Pay with crypto (CryptoCloud)',
    choosePaymentMethod: 'Choose payment method',
    confirmAndContinueToPayment: 'Continue to payment',
    paymentPageEyebrow: 'Payment',
    paymentPageTitle: (orderId) => `Pay for order #${orderId}`,
    paymentPageSubtitle: 'Review your details and choose how you want to pay.',
    reviewOrderDetails: 'Order details',
    proceedToPayment: 'Proceed to payment',
    amountDue: 'Amount due',
    paymentAmountHint: 'You will be redirected to the payment provider after clicking the button.',
    paymentMethodPaymentoHint: 'Pay with cryptocurrency via Paymento.',
    paymentMethodCryptoCloudHint: 'Pay with cryptocurrency via CryptoCloud.',
    trackOrder: 'Track order',
    trackOrderTitle: 'Find your order',
    trackOrderSubtitle: 'Enter your order number and the email used at checkout.',
    trackOrderHint: 'You will see order status, items, and payment confirmation.',
    orderNumberLabel: 'Order number',
    orderNumberPlaceholder: 'e.g. 42',
    findOrder: 'Find order',
    orderConfirmationTitle: 'Order confirmed',
    orderConfirmationMessage:
      'Thank you! Your payment was received. We will process and ship your order soon.',
    orderStatusTitle: (orderId) => `Order #${orderId}`,
    orderPendingPaymentMessage: 'Payment is pending. Complete payment to confirm your order.',
    completePayment: 'Complete payment',
    orderStatusPaid: 'Paid',
    orderStatusPending: 'Awaiting payment',
    orderStatusProcessing: 'Processing',
    orderStatusShipped: 'Shipped',
    orderStatusDelivered: 'Delivered',
    orderStatusCancelled: 'Cancelled',
    paymentReturnNoOrderId:
      'Could not determine your order. Use Track order with your order number and email.',
    paymentEmailRequiredMessage:
      'Enter the email you used at checkout so we can verify your payment status.',
    orderEmailRequiredTitle: 'Confirm your email',
    orderEmailRequiredSubtitle: 'Enter the email from checkout to view this order.',
    orderEmailRequiredHint: 'We use your email to verify access to order details.',
    continueWithEmail: 'Continue',
    orderHistoryTitle: 'Your orders',
    orderHistoryHint: 'All orders placed with this email address.',
    loadOrderHistory: 'Show my orders',
    orderHistoryEmpty: 'No orders found for this email.',
    redirectingToPay: 'Redirecting to payment…',
    paymentSuccessTitle: 'Payment successful',
    paymentFailedTitle: 'Payment not completed',
    paymentReturnSuccess:
      'Thank you! We received your payment. Order status updates after the provider confirms the transaction.',
    paymentReturnFail: 'Payment was cancelled or failed. You can try again from the order page.',
    paymentConfirmingTitle: 'Confirming payment…',
    paymentConfirmingMessage: (orderId) =>
      `Order #${orderId} — waiting for payment confirmation. This usually takes a few seconds.`,
    paymentConfirmingTimeout:
      'Payment is still processing. Check your order page in a minute — status updates automatically.',
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
