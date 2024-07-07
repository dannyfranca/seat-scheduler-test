import { defineRoute } from '@/utils/factories';

export const defineListSeats = defineRoute((rest) =>
  rest.get('/:eventId/available-seats', async (c) => {
    const eventId = c.req.param('eventId');
    const { availableSeats } = await c.var.deps.listAvailableSeats.execute({ eventId });
    // TODO: implement
    return c.json(
      {
        availableSeats,
      } satisfies ResponseBody,
      201
    );
  })
);

interface ResponseBody {
  availableSeats: Array<{ seatId: string }>;
}
