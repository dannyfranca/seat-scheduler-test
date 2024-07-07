import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { defineRoute } from '@/utils/factories';

export const defineCreateEvent = defineRoute((rest) =>
  rest.post('/', zValidator('json', bodySchema), async (c) => {
    const { totalSeats } = c.req.valid('json');
    const { eventId } = await c.var.deps.createEvent.execute({ totalSeats });

    return c.json(
      {
        eventId,
      } satisfies ResponseBody,
      201
    );
  })
);

const bodySchema = z.object({
  totalSeats: z.number().int(),
});

interface ResponseBody {
  eventId: string;
}
