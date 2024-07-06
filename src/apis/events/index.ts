import { createRestApi } from '@/utils/create-rest-api';
import { defineCreateEvent } from './routes/create-event';
import { defineReserveSeat } from './routes/reserve-seat';
import { defineRefreshSeat } from './routes/refresh-seat';
import { defineHoldSeat } from './routes/hold-seat';
import { defineListSeats } from './routes/list-seats';

export const createEventsApi = (deps: Dependencies) => {
  const rest = createRestApi(deps);

  defineCreateEvent(rest);
  defineListSeats(rest);
  defineHoldSeat(rest);
  defineReserveSeat(rest);
  defineRefreshSeat(rest);

  return rest;
};
