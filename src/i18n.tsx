import { createContext, useContext, useEffect, useMemo } from 'react';

export type Language = 'uk';

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
  confirming: string;
  invalidEmail: string;
  invalidOrderId: string;
  loadingOrder: string;
  cannotLoadOrder: string;
  order: string;
  status: string;
  positions: string;
  processing: string;
  payTest: string;
  toCatalog: string;
  paymentDone: string;
  notFound: string;
  notFoundHint: string;
  toHome: string;
  genericErrorTitle: string;
  genericErrorMessage: string;
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

const t: Messages = {
  navCatalog: 'Магазин',
  navCart: 'Кошик',
  navCheckout: 'Оформлення',
  brandSubtitle: 'Офіційний мерч Dream Step',
  heroBadge: 'НОВИЙ ДРОП',
  heroTitle: 'Носи мрію.',
  heroSubtitle: 'Офіційний мерч Dream Step — преміум стрітвір для спільноти.',
  heroCta: 'Перейти до дропу',
  loadingProducts: 'Завантажуємо товари...',
  pleaseWait: 'Зачекайте трохи.',
  cannotLoadCatalog: 'Не вдалося отримати каталог',
  emptyCatalog: 'Каталог порожній',
  productsSoon: 'Нові дропи скоро.',
  catalogTitle: 'Мерч Dream Step',
  catalogSubtitle: 'Лімітовані дропи. Преміум якість. Тільки для мрійників.',
  priceOnRequest: 'За запитом',
  viewProduct: 'Відкрити',
  invalidProductId: 'Невірний ідентифікатор товару',
  loadingProduct: 'Завантажуємо товар...',
  cannotLoadProduct: 'Не вдалося завантажити товар',
  noVariants: 'Немає доступних варіантів',
  qtyPositive: 'Кількість має бути більшою за 0.',
  backToCatalog: 'У магазин',
  chooseSize: 'Обери розмір',
  outOfStockShort: 'Продано',
  quantity: 'Кількість',
  addToCart: 'У кошик',
  adding: 'Додаємо...',
  addedToCart: 'Додано в кошик',
  emptyCart: 'Твій кошик порожній',
  addFromCatalog: 'Саме час обрати свіжий мерч.',
  loadingCart: 'Завантажуємо кошик...',
  cannotLoadCart: 'Не вдалося завантажити кошик',
  chooseFromCatalog: 'Загляни в каталог і обери свій стиль.',
  yourCart: 'Твій кошик',
  cartHint: 'Перевір позиції перед оформленням.',
  size: 'Розмір',
  price: 'Ціна',
  remove: 'Видалити',
  total: 'Разом',
  checkout: 'Оформити',
  noActiveCart: 'Немає активного кошика',
  addBeforeCheckout: 'Додай товари перед оформленням.',
  orderCreated: 'Замовлення підтверджено',
  viewOrder: 'Відкрити замовлення',
  loadingCartData: 'Завантажуємо дані...',
  cannotGetCart: 'Не вдалося отримати кошик',
  addItemToCheckout: 'Додай хоча б один товар.',
  checkoutTitle: 'Оформлення',
  checkoutSubtitle: 'Вкажи контакти та повну адресу доставки (країна, місто, індекс, вулиця).',
  phoneLabel: 'Телефон',
  recipientNameLabel: 'ПІБ отримувача',
  sectionContact: 'Контакти',
  sectionShipping: 'Адреса доставки',
  countryLabel: 'Країна',
  regionLabel: 'Область / регіон',
  cityLabel: 'Місто',
  postalLabel: 'Поштовий індекс',
  addressLineLabel: 'Вулиця, будинок, квартира',
  shippingNotesLabel: 'Коментар до доставки (необов’язково)',
  notesHeading: 'Коментар',
  invalidPhone: 'Вкажи коректний номер телефону (мінімум 5 символів).',
  fillRequired: 'Заповни всі обов’язкові поля.',
  payNow: 'До сплати',
  confirm: 'Підтвердити',
  confirming: 'Підтвердження...',
  invalidEmail: 'Вкажи коректний email.',
  invalidOrderId: 'Невірний номер замовлення',
  loadingOrder: 'Завантажуємо замовлення...',
  cannotLoadOrder: 'Не вдалося отримати замовлення',
  order: 'Замовлення',
  status: 'Статус',
  positions: 'Позиції',
  processing: 'Опрацьовуємо...',
  payTest: 'Оплатити (тест)',
  toCatalog: 'Продовжити',
  paymentDone: 'Оплату підтверджено.',
  notFound: 'Сторінку не знайдено',
  notFoundHint: 'Здається, цей дроп уже закінчився.',
  toHome: 'На головну',
  genericErrorTitle: 'Щось пішло не так',
  genericErrorMessage: 'Сталася неочікувана помилка. Спробуй оновити сторінку.',
  currencyLabel: 'Валюта',
  items: 'товарів',
  freeShipping: 'Безкоштовна доставка від ₴1500',
  authentic: '100% офіційний мерч',
  fastDelivery: 'Відправка за 48 годин',
  yourSelection: 'Твій вибір',
  emailLabel: 'Email',
  emailPlaceholder: 'you@example.com',
  phonePlaceholder: '+380 XX XXX XX XX',
  placeholders: {
    country: 'наприклад, Україна',
    region: 'наприклад, Київська область',
    city: 'наприклад, Київ',
    postal: 'наприклад, 01001',
    address: 'Вулиця, будинок, кв., під’їзд, поверх',
    recipient: 'Ім’я та прізвище',
    notes: 'Інструкції для кур’єра, час…',
  },
  itemsCount: (n) => (n === 1 ? '1 товар' : `${n} товарів`),
  orderCreatedMessage: (id, total) => `Замовлення №${id} підтверджено. Разом: ${total}.`,
};

type I18nContextValue = {
  language: Language;
  t: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.documentElement.lang = 'uk';
  }, []);

  const value = useMemo<I18nContextValue>(() => ({ language: 'uk', t }), []);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
};
