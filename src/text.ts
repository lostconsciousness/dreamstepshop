import { decodeCp437Mojibake } from './cp437';

/** UTF-8 em dash (—) saved after a CP1251 misread of UTF-8 bytes. */
const CP1251_EM_DASH = /\u0442\u0410\u0424/g;

const looksLikeLatin1Mojibake = (value: string): boolean =>
  /[\u00C0-\u00DF][\u0080-\u00BF]/.test(value);

const decodeLatin1Mojibake = (value: string): string | null => {
  try {
    const bytes = Uint8Array.from([...value].map((char) => char.charCodeAt(0) & 0xff));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    try {
      return decodeURIComponent(escape(value));
    } catch {
      return null;
    }
  }
};

const normalizeDash = (value: string): string => value.replace(CP1251_EM_DASH, '\u2014');

/** Russian import metadata appended to English product titles. */
const CYRILLIC_CLAUSE = /\s+[\u0400-\u04FF]+(?:\s*\+\s*[\u0400-\u04FF]+)*/g;

const collapseSpaces = (value: string): string => value.replace(/\s+/g, ' ').trim();

/** Repairs common UTF-8 mojibake coming from the catalog import pipeline. */
export const repairMojibake = (value: string | null | undefined): string | null => {
  if (value == null) {
    return null;
  }

  let text = normalizeDash(value);

  const cp437Decoded = decodeCp437Mojibake(text);
  if (cp437Decoded && cp437Decoded !== text) {
    text = normalizeDash(cp437Decoded);
  } else if (looksLikeLatin1Mojibake(text)) {
    const latin1Decoded = decodeLatin1Mojibake(text);
    if (latin1Decoded && latin1Decoded !== text) {
      text = normalizeDash(latin1Decoded);
    }
  }

  return text;
};

/** EN storefront: fix encoding and drop Russian import suffixes from titles. */
export const cleanProductNameForDisplay = (value: string | null | undefined): string | null => {
  const repaired = repairMojibake(value);
  if (repaired == null) {
    return null;
  }
  return collapseSpaces(repaired.replace(CYRILLIC_CLAUSE, ''));
};

export const cleanProductDescriptionForDisplay = (
  value: string | null | undefined,
): string | null => {
  const repaired = repairMojibake(value);
  if (repaired == null) {
    return null;
  }
  return collapseSpaces(repaired.replace(CYRILLIC_CLAUSE, ''));
};

export const splitDescriptionParagraphs = (value: string): string[] =>
  value
    .split(/\n{2,}|\n/)
    .map((part) => part.trim())
    .filter(Boolean);

export const truncateText = (value: string, maxLength = 96): string => {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength).trimEnd()}…`;
};
