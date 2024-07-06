import 'hono';

interface HonoBindings extends AppConfig {
  [key: string]: unknown;
}

declare module 'hono' {
  interface Env {
    Bindings: HonoBindings;
    Variables: {
      deps: Dependencies;
    };
  }
}

export {};
