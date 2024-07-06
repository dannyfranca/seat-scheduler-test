import { defineHandler } from '@/utils/factories';

export const handleListSeats = defineHandler<':eventId'>((c) => {
  const eventId = c.req.param('eventId');
  return c.json({}, 200);
});
