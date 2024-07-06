import 'hono';

declare module 'hono' {
  interface Env {
    Bindings: AppConfig;
    Variables: {
      deps: Dependencies;
    };
  }
}

export {};
