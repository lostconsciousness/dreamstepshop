import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Currency } from './types';

const STORAGE_KEY = 'ui_currency';

const isCurrency = (value: string | null): value is Currency => {
  return value === 'usd' || value === 'eur' || value === 'uah';
};

const getInitialCurrency = (): Currency => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isCurrency(stored)) {
      return stored;
    }
  } catch {
    // ignore
  }
  return 'usd';
};

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (next: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

let CURRENT_CURRENCY: Currency = getInitialCurrency();

export const getCurrentCurrency = (): Currency => CURRENT_CURRENCY;

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>(CURRENT_CURRENCY);

  useEffect(() => {
    CURRENT_CURRENCY = currency;
    window.dispatchEvent(new CustomEvent('currency-changed'));
  }, [currency]);

  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const value = useMemo<CurrencyContextValue>(() => ({ currency, setCurrency }), [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): CurrencyContextValue => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used inside CurrencyProvider');
  }
  return ctx;
};
