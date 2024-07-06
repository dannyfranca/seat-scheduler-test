import { createRestApi } from '@/utils/create-rest-api';

export const createHealthApi = (deps: Dependencies) => {
  const rest = createRestApi(deps);

  rest.get('/', (c) => {
    // TODO: implement proper health-check
    return c.text('OK', 200);
  });

  return rest;
};
