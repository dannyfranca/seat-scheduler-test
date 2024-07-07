import { defineMiddleware } from '@/utils/factories';

export const defineCorsMiddleware = defineMiddleware(async (c, next) => {
  await next();

  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  c.header('Access-Control-Allow-Headers', '*');
});
