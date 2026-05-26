/** UTF-8 em dash (—) saved after a CP1251 misread of UTF-8 bytes. */
const CP1251_EM_DASH = /\u0442\u0410\u0424/g;

const looksLikeLatin1Mojibake = (value: string): boolean =>
  /[\u00C0-\u00DF][\u0080-\u00BF]/.test(value) || /[\u2550-\u256C]{2,}/.test(value);

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

/** Repairs common UTF-8 mojibake coming from the catalog import pipeline. */
export const repairMojibake = (value: string | null | undefined): string | null => {
  if (value == null) {
    return null;
  }

  let text = value.replace(CP1251_EM_DASH, '\u2014');
  if (!looksLikeLatin1Mojibake(text)) {
    return text;
  }

  const decoded = decodeLatin1Mojibake(text);
  if (!decoded || decoded === text) {
    return text;
  }

  return decoded.replace(CP1251_EM_DASH, '\u2014');
};
