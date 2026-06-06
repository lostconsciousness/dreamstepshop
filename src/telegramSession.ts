const TELEGRAM_ID_STORAGE_KEY = 'telegram_id';

const normalizeTelegramId = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  if (!trimmed || !/^\d{1,32}$/.test(trimmed)) {
    return null;
  }

  return trimmed;
};

export const storeTelegramId = (value: string | null | undefined): string | null => {
  const telegramId = normalizeTelegramId(value);

  if (!telegramId) {
    return null;
  }

  sessionStorage.setItem(TELEGRAM_ID_STORAGE_KEY, telegramId);
  return telegramId;
};

export const getStoredTelegramId = (): number | null => {
  try {
    const telegramId = normalizeTelegramId(sessionStorage.getItem(TELEGRAM_ID_STORAGE_KEY));
    return telegramId ? Number(telegramId) : null;
  } catch {
    return null;
  }
};
