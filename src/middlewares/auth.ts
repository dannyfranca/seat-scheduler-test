import { defineMiddleware } from '@/utils/factories';

export const authMiddleware = defineMiddleware(async (c, next) => {
  c.set('userId', 'd08c3218-a5ac-4ae0-bb40-d9d047db990f');
  await next();
});
