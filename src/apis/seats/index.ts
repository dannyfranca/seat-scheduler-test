import { createRestApi } from '@/utils/create-rest-api';
import { defineHoldSeat } from './routes/hold';
import { defineReserveSeat } from './routes/reserve';

export const createSeatsApi = (deps: Dependencies) => {
  const rest = createRestApi(deps);

  defineHoldSeat(rest);
  defineReserveSeat(rest);

  return rest;
};
