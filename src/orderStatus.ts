import type { Messages } from './i18n';

export const isOrderCancelled = (status: string): boolean => /cancel/i.test(status);

export const isOrderShipped = (status: string): boolean => /shipped|delivered/i.test(status);

export const getOrderStatusLabel = (status: string, t: Messages): string => {
  const normalized = status.trim().toLowerCase();
  if (/paid|completed|success/.test(normalized)) {
    return t.orderStatusPaid;
  }
  if (/pending/.test(normalized)) {
    return t.orderStatusPending;
  }
  if (/processing/.test(normalized)) {
    return t.orderStatusProcessing;
  }
  if (/shipped/.test(normalized)) {
    return t.orderStatusShipped;
  }
  if (/delivered/.test(normalized)) {
    return t.orderStatusDelivered;
  }
  if (/cancel/.test(normalized)) {
    return t.orderStatusCancelled;
  }
  return status;
};
