import { type Hono, type Env } from 'hono';
import { Input, MiddlewareHandler, type Schema } from 'hono/types';

export const defineRoute = <E extends Env = Env, S extends Schema = Schema, BasePath extends string = '/'>(
  restFactory: (rest: Hono<E, S, BasePath>) => Hono<E, S, BasePath>
) => restFactory;

/**
 * Defines a middleware in a type-safe way.
 */
export const defineMiddleware = <E extends Env = Env, P extends string = string, I extends Input = Input>(
  middleware: MiddlewareHandler<E, P, I>
) => middleware;
