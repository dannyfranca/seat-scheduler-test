// import { createMyriadApi } from './apis/myriad';
import { createEventsApi } from './apis/events';
import { createHealthApi } from './apis/health';
import { injectDependencies } from './middlewares/inject-dependencies';
import { onGoingRequests } from './middlewares/ongoing-requests';
import { createRestApi } from './utils/create-rest-api';

/**
 * Creates the application by composing the REST API endpoints and setting global middlewares.
 */
export const createApp = (deps: Dependencies) =>
  createRestApi(deps)
    .use('*', injectDependencies(deps))
    .use('*', onGoingRequests(deps.lifecycleManager))
    .route('/events', createEventsApi(deps))
    .route('/health', createHealthApi(deps));
