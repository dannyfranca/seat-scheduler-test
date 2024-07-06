import { defineHandler } from '@/utils/factories';

export const handleCreateEvent = defineHandler((c) => {
  return c.json({}, 201);
});
