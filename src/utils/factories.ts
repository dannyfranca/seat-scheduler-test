import { type Env } from 'hono';
import { Input, MiddlewareHandler, Handler } from 'hono/types';

/**
 * Defines a handler middleware in a type-safe way.
 */
export const defineHandler = <P extends string = string, E extends Env = Env, I extends Input = Input>(
  handler: Handler<E, P, I>
) => handler;

/**
 * Defines a middleware in a type-safe way.
 */
export const defineMiddleware = <E extends Env = Env, P extends string = string, I extends Input = Input>(
  middleware: MiddlewareHandler<E, P, I>
) => middleware;
