import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StateBlock } from './components/State';
import { useI18n } from './i18n';
import { CartPage } from './pages/CartPage';
import { CatalogPage } from './pages/CatalogPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OrderPage } from './pages/OrderPage';
import { PaymentFailedPage } from './pages/PaymentFailedPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { ProductPage } from './pages/ProductPage';

const RouteErrorElement = () => {
  const { t } = useI18n();
  return (
    <StateBlock
      emoji="💥"
      title={t.genericErrorTitle}
      message={t.genericErrorMessage}
      actions={
        <a href="/" className="btn btn-primary">
          {t.toHome}
        </a>
      }
    />
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorElement />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'products/:id', element: <ProductPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'orders/:id', element: <OrderPage /> },
      { path: 'payment-success', element: <PaymentSuccessPage /> },
      { path: 'payment-failed', element: <PaymentFailedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
