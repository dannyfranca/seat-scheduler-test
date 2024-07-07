import { defineMiddleware } from '@/utils/factories';

export const defineDependencyInjectionMiddleware = (deps: Dependencies) =>
  defineMiddleware(async (c, next) => {
    c.set('deps', deps);

    await next();
  });
