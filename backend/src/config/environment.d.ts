declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'test' | 'production';
      PORT: string;
      CORS_ORIGIN: string;
      DATABASE_URL: string;
    }
  }
}

export {};
