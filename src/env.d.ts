declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      CORS_ORIGIN: string;
      DATABASE_URL: string;
    }
  }
}

export {}
