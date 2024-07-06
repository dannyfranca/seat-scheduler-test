import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { defineRoute } from '@/utils/factories';

export const defineHoldSeat = defineRoute((rest) =>
  rest.post('/:eventId/seats/:seatId/hold', zValidator('json', bodySchema), async (c) => {
    const body = c.req.valid('json');
    const seatId = c.req.param('seatId');
    const eventId = c.req.param('eventId');
    // TODO: implement
    return c.json(
      {
        eventId: '',
        seatId: '',
        userId: '',
        holdExpiresAt: '',
      } satisfies ResponseBody,
      201
    );
  })
);

const bodySchema = z.object({
  userId: z.string().uuid(),
});

interface ResponseBody {
  eventId: string;
  seatId: string;
  userId: string;
  holdExpiresAt: string; // ISO 8601 timestamp
}
