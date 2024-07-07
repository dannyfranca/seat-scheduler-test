import { defineRoute } from '@/utils/factories';

export const defineRefreshSeat = defineRoute((rest) =>
  rest.post('/:seatId/hold/refresh', async (c) => {
    const seatId = c.req.param('seatId');
    const userId = c.var.userId;
    await c.var.deps.refreshSeat.execute({ userId, seatId });
    return c.json({} satisfies ResponseBody, 201);
  })
);

interface ResponseBody {}
