import { defineRoute } from '@/utils/factories';

export const defineHoldSeat = defineRoute((rest) =>
  rest.post('/:eventId/seats/:seatId/hold', async (c) => {
    const seatId = c.req.param('seatId');
    const userId = c.var.userId;
    const { holdExpiresAt } = await c.var.deps.holdSeat.execute({ userId, seatId });
    return c.json(
      {
        holdExpiresAt: holdExpiresAt.toISOString(),
      } satisfies ResponseBody,
      201
    );
  })
);

interface ResponseBody {
  holdExpiresAt: string; // ISO 8601 timestamp
}
