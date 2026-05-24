/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_CRYPTOCLOUD_API_KEY?: string;
  readonly VITE_CRYPTOCLOUD_SHOP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
