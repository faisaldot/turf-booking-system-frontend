/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly VITE_APP_URL: string;
	readonly VITE_SSL_STORE_ID: string;
	readonly VITE_ENABLE_DEVTOOLS: "true" | "false";
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
