import { API_BASE_URL } from './config';

export const PRODUCT_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80';

/** Catalog asset path from API or absolute backend URL. */
const toSameOriginStaticPath = (value: string): string | null => {
  if (value.startsWith('/static/') || value.startsWith('static/')) {
    return value.startsWith('/') ? value : `/${value}`;
  }
  try {
    const url = new URL(value);
    if (url.pathname.startsWith('/static/')) {
      return url.pathname;
    }
  } catch {
    // not an absolute URL
  }
  return null;
};

/** Turns `/static/catalog/...` from the API into an absolute URL on the API host. */
export const resolveProductImageUrl = (imageUrl: string | null | undefined): string | null => {
  const trimmed = imageUrl?.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.startsWith('data:')) {
    return trimmed;
  }

  const staticPath = toSameOriginStaticPath(trimmed);
  if (staticPath) {
    return staticPath;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const base = API_BASE_URL;
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
};

export const getProductImageSrc = (imageUrl: string | null | undefined): string => {
  return resolveProductImageUrl(imageUrl) ?? PRODUCT_PLACEHOLDER_IMAGE;
};
