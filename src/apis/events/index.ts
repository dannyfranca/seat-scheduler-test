import { createRestApi } from '@/utils/create-rest-api';
import { handleCreateEvent } from './routes/create-event';
import { handleListSeats } from './routes/list-seats';
import { handleHoldSeat } from './routes/hold-seat';
import { handleReserveSeat } from './routes/reserve-seat';
import { handleRefreshSeat } from './routes/refresh-seat';

export const createEventsApi = (deps: Dependencies) => {
  const rest = createRestApi(deps);

  rest.post('/', handleCreateEvent);
  rest.get('/:eventId/seats', handleListSeats);
  rest.post('/:eventId/seats/:seatId/hold', handleHoldSeat);
  rest.post('/:eventId/seats/:seatId/reserve', handleReserveSeat);
  rest.post('/:eventId/seats/:seatId/hold/refresh', handleRefreshSeat);

  return rest;
};
