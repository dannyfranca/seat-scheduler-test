import { defineMiddleware } from '@/utils/factories';

export const injectDependencies = (deps: Dependencies) =>
  defineMiddleware(async (c, next) => {
    c.set('deps', deps);

    await next();
  });
