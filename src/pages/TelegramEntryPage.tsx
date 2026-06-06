import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CatalogPage } from './CatalogPage';
import { NotFoundPage } from './NotFoundPage';
import { storeTelegramId } from '../telegramSession';

export const TelegramEntryPage = () => {
  const { tgId } = useParams();
  const telegramId = tgId?.trim() ?? '';
  const isTelegramId = /^\d{1,32}$/.test(telegramId);

  useEffect(() => {
    if (isTelegramId) {
      storeTelegramId(telegramId);
    }
  }, [isTelegramId, telegramId]);

  if (!isTelegramId) {
    return <NotFoundPage />;
  }

  return <CatalogPage />;
};
