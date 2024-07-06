// import { createMyriadApi } from './apis/myriad';
import { createEventsApi } from './apis/events';
import { injectDependencies } from './middlewares/inject-dependencies';
import { createRestApi } from './utils/create-rest-api';

export const createApp = (deps: Dependencies) =>
  createRestApi(deps).use('*', injectDependencies(deps)).route('/events', createEventsApi(deps));
