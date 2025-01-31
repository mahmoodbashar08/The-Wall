// src/@types/global.d.ts

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
      initData?: string;
    };
  }
}

// This line is required for TypeScript to recognize the file as a module
export {};
