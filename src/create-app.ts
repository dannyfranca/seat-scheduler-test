import { createEventsApi } from './apis/events';
import { createHealthApi } from './apis/health';
import { createSeatsApi } from './apis/seats';
import { authMiddleware } from './middlewares/auth';
import { defineCorsMiddleware } from './middlewares/cors';
import { defineDependencyInjectionMiddleware } from './middlewares/inject-dependencies';
import { defineOnGoingRequestsMiddleware } from './middlewares/ongoing-requests';
import { createRestApi } from './utils/create-rest-api';

/**
 * Creates the application by composing the REST API endpoints and setting global middlewares.
 */
export const createApp = (deps: Dependencies) =>
  createRestApi(deps)
    .basePath('/v1')
    .use('*', authMiddleware)
    .use('*', defineCorsMiddleware)
    .use('*', defineDependencyInjectionMiddleware(deps))
    .use('*', defineOnGoingRequestsMiddleware(deps.lifecycleManager))
    .options('*', async () => new Response(null, { status: 204 }))
    .route('/events', createEventsApi(deps))
    .route('/seats', createSeatsApi(deps))
    .route('/health', createHealthApi(deps));
