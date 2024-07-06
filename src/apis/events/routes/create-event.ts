import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { defineRoute } from '@/utils/factories';

export const defineCreateEvent = defineRoute((rest) =>
  rest.post('/', zValidator('json', bodySchema), async (c) => {
    const body = c.req.valid('json');
    // TODO: implement
    return c.json(
      {
        eventId: '',
        totalSeats: 0,
        availableSeats: 0,
      } satisfies ResponseBody,
      201
    );
  })
);

const bodySchema = z.object({
  totalSeats: z.number(),
});

interface ResponseBody {
  eventId: string;
  totalSeats: number;
  availableSeats: number;
}
