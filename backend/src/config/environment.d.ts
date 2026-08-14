declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: number;
      CORS_ORIGIN: string;
    }
  }
}

export {};
