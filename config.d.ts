declare global {
  interface AppConfig {
    APP_NAME: string;
    PORT: string;
    REDIS_URI: string;
    POSTGRES_URI: string;
  }
}

export {};
