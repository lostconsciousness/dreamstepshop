import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { CurrencyProvider } from './currency';
import { I18nProvider } from './i18n';
import { queryClient } from './queryClient';
import './style.css';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <I18nProvider>
      <CurrencyProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </CurrencyProvider>
    </I18nProvider>
  </React.StrictMode>,
);
