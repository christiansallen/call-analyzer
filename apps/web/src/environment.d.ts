declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_CLERK_PUBLISHABLE_KEY: string;
      VITE_CLERK_SECRET_KEY: string;
      VITE_DATABASE_URL: string;
    }
  }
}

export {};
