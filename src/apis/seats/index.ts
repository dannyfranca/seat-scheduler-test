import { createRestApi } from '@/utils/create-rest-api';
import { defineHoldSeat } from './routes/hold';
import { defineReserveSeat } from './routes/reserve';
import { defineRefreshSeat } from './routes/refresh';

export const createSeatsApi = (deps: Dependencies) => {
  const rest = createRestApi(deps);

  defineHoldSeat(rest);
  defineReserveSeat(rest);
  defineRefreshSeat(rest);

  return rest;
};
