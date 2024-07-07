import { createRestApi } from '@/utils/create-rest-api';
import { defineCreateEvent } from './routes/create-event';
import { defineListAvailableSeats } from './routes/list-available-seats';

export const createEventsApi = (deps: Dependencies) => {
  const rest = createRestApi(deps);

  defineCreateEvent(rest);
  defineListAvailableSeats(rest);

  return rest;
};
