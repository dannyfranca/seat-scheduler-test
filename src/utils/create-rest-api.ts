import { type Env, Hono, type Schema } from 'hono';
import { errorHandler } from './error-handler';

/**
 * Creates a REST API instance with base config, middlewares and error handling.
 */
export const createRestApi = <E extends Env = Env, S extends Schema = Schema, BasePath extends string = '/'>(
  deps: Dependencies
) => new Hono<E, S, BasePath>({ strict: false }).onError(errorHandler(deps));
