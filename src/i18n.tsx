import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'ru';

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
  freeShipping: string;
  authentic: string;
  fastDelivery: string;
  yourSelection: string;
  emailLabel: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  phoneLabel: string;
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
    freeShipping: 'Free shipping over ₴1500',
    authentic: '100% authentic merch',
    fastDelivery: 'Ships within 48h',
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
    },
    itemsCount: (n) => (n === 1 ? '1 item' : `${n} items`),
    orderCreatedMessage: (id, total) => `Order #${id} confirmed. Total: ${total}.`,
  },
  ru: {
    navCatalog: 'Магазин',
    navCart: 'Корзина',
    navCheckout: 'Оформление',
    brandSubtitle: 'Официальный мерч Dream Step',
    heroBadge: 'НОВЫЙ ДРОП',
    heroTitle: 'Носи мечту.',
    heroSubtitle: 'Официальный мерч Dream Step — премиум стритвир для коммьюнити.',
    heroCta: 'Перейти к дропу',
    loadingProducts: 'Загружаем товары...',
    pleaseWait: 'Подожди немного.',
    cannotLoadCatalog: 'Не удалось загрузить каталог',
    emptyCatalog: 'Каталог пуст',
    productsSoon: 'Новые дропы скоро.',
    catalogTitle: 'Мерч Dream Step',
    catalogSubtitle: 'Лимитированные дропы. Премиум качество. Только для своих.',
    categoryAll: 'Все',
    categoryFilterLabel: 'Категории',
    emptyCategory: 'В этой категории пока пусто',
    emptyCategoryHint: 'Выбери другую категорию или смотри весь каталог.',
    categoryLabel: (category) => {
      const labels: Record<string, string> = {
        Одежда: 'Одежда',
        Обувь: 'Обувь',
        Аксессуары: 'Аксессуары',
        Посуда: 'Посуда',
      };
      return labels[category] ?? category;
    },
    priceOnRequest: 'По запросу',
    viewProduct: 'Открыть',
    invalidProductId: 'Неверный идентификатор товара',
    loadingProduct: 'Загружаем товар...',
    cannotLoadProduct: 'Не удалось загрузить товар',
    noVariants: 'Нет доступных вариантов',
    qtyPositive: 'Количество должно быть больше 0.',
    backToCatalog: 'В магазин',
    chooseSize: 'Выбери размер',
    outOfStockShort: 'Продано',
    quantity: 'Количество',
    addToCart: 'В корзину',
    adding: 'Добавляем...',
    addedToCart: 'Добавлено в корзину',
    emptyCart: 'Твоя корзина пуста',
    addFromCatalog: 'Самое время выбрать свежий мерч.',
    loadingCart: 'Загружаем корзину...',
    cannotLoadCart: 'Не удалось загрузить корзину',
    chooseFromCatalog: 'Загляни в каталог и выбери свой стиль.',
    yourCart: 'Твоя корзина',
    cartHint: 'Проверь позиции перед оформлением.',
    size: 'Размер',
    price: 'Цена',
    remove: 'Удалить',
    total: 'Итого',
    checkout: 'Оформить',
    noActiveCart: 'Нет активной корзины',
    addBeforeCheckout: 'Добавь товары перед оформлением.',
    orderCreated: 'Заказ подтверждён',
    viewOrder: 'Открыть заказ',
    loadingCartData: 'Загружаем данные...',
    cannotGetCart: 'Не удалось получить корзину',
    addItemToCheckout: 'Добавь хотя бы один товар.',
    checkoutTitle: 'Оформление',
    checkoutSubtitle: 'Укажи контакты и полный адрес доставки (страна, город, индекс, улица).',
    phoneLabel: 'Телефон',
    recipientNameLabel: 'ФИО получателя',
    sectionContact: 'Контакты',
    sectionShipping: 'Адрес доставки',
    countryLabel: 'Страна',
    regionLabel: 'Область / регион',
    cityLabel: 'Город',
    postalLabel: 'Почтовый индекс',
    addressLineLabel: 'Улица, дом, квартира',
    shippingNotesLabel: 'Комментарий к доставке (необязательно)',
    notesHeading: 'Комментарий',
    invalidPhone: 'Укажи корректный телефон (минимум 5 символов).',
    fillRequired: 'Заполни все обязательные поля.',
    payNow: 'К оплате',
    confirm: 'Оформить заказ',
    confirmAndPay: 'Оформить и оплатить',
    confirming: 'Подтверждение...',
    confirmingAndPaying: 'Создаём заказ, переход к оплате…',
    checkoutRedirectingMessage: (orderId) =>
      `Заказ №${orderId} создан. Открываем страницу оплаты CryptoCloud…`,
    invalidEmail: 'Введи корректный email.',
    invalidOrderId: 'Неверный номер заказа',
    loadingOrder: 'Загружаем заказ...',
    cannotLoadOrder: 'Не удалось получить заказ',
    order: 'Заказ',
    status: 'Статус',
    positions: 'Позиции',
    processing: 'Обрабатываем...',
    payCrypto: 'Оплатить криптой',
    redirectingToPay: 'Переход к оплате…',
    paymentSuccessTitle: 'Оплата прошла',
    paymentFailedTitle: 'Оплата не завершена',
    paymentReturnSuccess:
      'Спасибо! Оплата получена. Статус заказа обновится после подтверждения от CryptoCloud.',
    paymentReturnFail: 'Оплата отменена или не прошла. Можно повторить на странице заказа.',
    tryPayAgain: 'Попробовать снова',
    toCatalog: 'Продолжить',
    paymentDone: 'Оплата подтверждена.',
    notFound: 'Страница не найдена',
    notFoundHint: 'Похоже, этот дроп уже закончился.',
    toHome: 'На главную',
    genericErrorTitle: 'Что-то пошло не так',
    genericErrorMessage: 'Произошла ошибка. Обнови страницу или вернись в магазин.',
    languageLabel: 'Язык',
    currencyLabel: 'Валюта',
    items: 'товаров',
    freeShipping: 'Бесплатная доставка от ₴1500',
    authentic: '100% официальный мерч',
    fastDelivery: 'Отправка за 48 часов',
    yourSelection: 'Твой выбор',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    phonePlaceholder: '+7 900 000-00-00',
    placeholders: {
      country: 'например, Россия',
      region: 'например, Московская область',
      city: 'например, Москва',
      postal: 'например, 101000',
      address: 'Улица, дом, кв., подъезд, этаж',
      recipient: 'Имя и фамилия',
      notes: 'Инструкции курьеру, время…',
    },
    itemsCount: (n) => (n === 1 ? '1 товар' : `${n} товаров`),
    orderCreatedMessage: (id, total) => `Заказ №${id} подтверждён. Итого: ${total}.`,
  },
};

const STORAGE_KEY = 'ui_language';

const isLanguage = (value: string | null): value is Language => {
  return value === 'en' || value === 'ru';
};

const getInitialLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) {
      return stored;
    }
    if (stored === 'uk') {
      return 'en';
    }
  } catch {
    // ignore
  }
  return 'en';
};

type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      language,
      setLanguage,
      t: messages[language],
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
};
