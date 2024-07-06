import { type Env } from 'hono';
import { Input, MiddlewareHandler, Handler } from 'hono/types';

export const defineHandler = <E extends Env = Env, P extends string = string, I extends Input = Input>(
  middleware: Handler<E, P, I>
) => middleware;

export const createMiddleware = <E extends Env = Env, P extends string = string, I extends Input = Input>(
  middleware: MiddlewareHandler<E, P, I>
) => middleware;
