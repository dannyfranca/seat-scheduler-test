import { createMiddleware } from '@/utils/factories';

export const injectDependencies = (deps: Dependencies) =>
  createMiddleware(async (c, next) => {
    c.set('deps', deps);

    await next();
  });
