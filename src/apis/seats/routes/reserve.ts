import { defineRoute } from '@/utils/factories';

export const defineReserveSeat = defineRoute((rest) =>
  rest.post('/:seatId/reserve', async (c) => {
    const seatId = c.req.param('seatId');
    const userId = c.var.userId;
    await c.var.deps.reserveSeat.execute({ userId, seatId });
    return c.json({} satisfies ResponseBody, 201);
  })
);

interface ResponseBody {}
