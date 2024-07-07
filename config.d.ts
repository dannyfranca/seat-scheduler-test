declare global {
  interface AppConfig {
    APP_NAME: string;
    PORT: string;
    POSTGRES_URI: string;
  }
}

export {};
