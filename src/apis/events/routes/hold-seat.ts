import { defineHandler } from '@/utils/factories';

export const handleHoldSeat = defineHandler<':eventId/:seatId'>((c) => {
  const seatId = c.req.param('seatId');
  const eventId = c.req.param('eventId');
  return c.json({}, 201);
});
