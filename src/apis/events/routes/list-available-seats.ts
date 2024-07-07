import { defineRoute } from '@/utils/factories';

export const defineListAvailableSeats = defineRoute((rest) =>
  rest.get('/:eventId/available-seats', async (c) => {
    const eventId = c.req.param('eventId');
    const { availableSeats } = await c.var.deps.listAvailableSeats.execute({ eventId });
    return c.json(
      {
        availableSeats,
      } satisfies ResponseBody,
      200
    );
  })
);

interface ResponseBody {
  availableSeats: Array<{ seatId: string }>;
}
