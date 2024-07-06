import { defineRoute } from '@/utils/factories';

export const defineListSeats = defineRoute((rest) =>
  rest.get('/:eventId/seats', async (c) => {
    // TODO: implement
    return c.json(
      {
        eventId: '',
        seats: [
          {
            seatId: '',
          },
        ],
      } satisfies ResponseBody,
      201
    );
  })
);

interface ResponseBody {
  eventId: string;
  seats: Array<{ seatId: string }>;
}
