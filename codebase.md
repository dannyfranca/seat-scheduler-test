# src/adapters/logger.ts

```ts
/**
 * Allowed Logger levels.
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

const logLevelCount = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

/**
 * Base Logger class to be extended by the actual logger implementations.
 */
export abstract class Logger<BaseType extends Record<string, any> = Record<string, any>> {
  constructor(
    public readonly logLevel: LogLevel = LogLevel.INFO,
    protected readonly baseContext?: Partial<BaseType>
  ) {}
  /**
   * General log method.
   *
   * @param message The message to log.
   * @param context The object is structured to send as a log context.
   * @param level The level of the log.
   */
  abstract log(message: string, context?: BaseType, level?: LogLevel): void;

  /**
   * Debug level log method.
   *
   * @param message The message to log.
   * @param context The object is structured to send as a log context.
   */
  debug(message: string, ...context: BaseType[]) {
    if (this.shouldNotLog(LogLevel.DEBUG)) return;
    return this.log(message, mergeContexts(context), LogLevel.DEBUG);
  }

  /**
   * Warn level log method.
   *
   * @param message The message to log.
   * @param context The object is structured to send as a log context.
   */
  warn(message: string, ...context: BaseType[]) {
    if (this.shouldNotLog(LogLevel.WARN)) return;
    return this.log(message, mergeContexts(context), LogLevel.WARN);
  }

  /**
   * Error level log method.
   *
   * @param message The message to log.
   * @param context The object is structured to send as a log context.
   */
  error(message: string, ...context: BaseType[]) {
    return this.log(message, mergeContexts(context), LogLevel.ERROR);
  }

  /**
   * Info level log method.
   *
   * @param message The message to log.
   * @param context The object is structured to send as a log context.
   */
  info(message: string, ...context: BaseType[]) {
    if (this.shouldNotLog(LogLevel.INFO)) return;
    return this.log(message, mergeContexts(context), LogLevel.INFO);
  }

  private shouldNotLog(level: LogLevel) {
    return logLevelCount[level] < logLevelCount[this.logLevel];
  }
}

const handleSpread = <T extends Record<string, any>>(context: T): T => {
  if ('toJSON' in context) return context['toJSON']();
  return context;
};

export const mergeContexts = <T extends Record<string, any>>(contexts: T[]): T =>
  contexts.reduce((acc, curr) => ({ ...acc, ...handleSpread(curr) }), {}) as T;

export class ConsoleLogger<
  BaseType extends Record<string, unknown> = Record<string, unknown>,
> extends Logger<BaseType> {
  constructor(logLevel: LogLevel = LogLevel.INFO, baseContext?: Partial<BaseType>) {
    super(logLevel, baseContext);
  }

  log<T extends BaseType>(message: string, context?: T, level = LogLevel.INFO): void {
    console[level](
      JSON.stringify({
        ...this.baseContext,
        ...context,
        m: message,
        t: Date.now(),
        l: level,
      })
    );
  }
}
```

# src/apis/events/index.ts

```ts
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
```

# src/apis/events/routes/create-event.ts

```ts
import { defineHandler } from '@/utils/factories';

export const handleCreateEvent = defineHandler((c) => {
  return c.json({}, 201);
});
```

# src/apis/events/routes/hold-seat.ts

```ts
import { defineHandler } from '@/utils/factories';

export const handleHoldSeat = defineHandler<':eventId/:seatId'>((c) => {
  const seatId = c.req.param('seatId');
  const eventId = c.req.param('eventId');
  return c.json({}, 201);
});
```

# src/apis/events/routes/list-seats.ts

```ts
import { defineHandler } from '@/utils/factories';

export const handleListSeats = defineHandler<':eventId'>((c) => {
  const eventId = c.req.param('eventId');
  return c.json({}, 200);
});
```

# src/apis/events/routes/refresh-seat.ts

```ts
import { defineHandler } from '@/utils/factories';

export const handleRefreshSeat = defineHandler<':eventId/:seatId'>((c) => {
  const seatId = c.req.param('seatId');
  const eventId = c.req.param('eventId');
  return c.json({}, 200);
});
```

# src/apis/events/routes/reserve-seat.ts

```ts
import { defineHandler } from '@/utils/factories';

export const handleReserveSeat = defineHandler<':eventId/:seatId'>((c) => {
  const seatId = c.req.param('seatId');
  const eventId = c.req.param('eventId');
  return c.json({}, 201);
});
```

# src/create-app.ts

```ts
// import { createMyriadApi } from './apis/myriad';
import { createEventsApi } from './apis/events';
import { injectDependencies } from './middlewares/inject-dependencies';
import { createRestApi } from './utils/create-rest-api';

/**
 * Creates the application by composing the REST API endpoints and setting global middlewares.
 */
export const createApp = (deps: Dependencies) =>
  createRestApi(deps).use('*', injectDependencies(deps)).route('/events', createEventsApi(deps));
```

# src/create-dependencies.ts

```ts
import { ConsoleLogger, LogLevel } from './adapters/logger';

/**
 * Creates a container that holds all dependencies for the application.
 * @param env The environment established values. Can be the environment variables or bindings, depending on the runtime.
 */
export const createDependencies = (env: AppConfig): Dependencies => {
  const appName = env.APP_NAME;
  const logger = new ConsoleLogger(LogLevel.INFO, { app: appName });

  return {
    logger,
  };
};
```

# src/load-configs.ts

```ts
import { checkRequiredEnvs } from './utils/check-required-envs';

/**
 * Depending on the runtime, environment variables might not be the safest place to store some secrets, since it can be inspected by users who have read-only access to the deployed resource. A async function to retrieve the secrets from a secret store at runtime may be desirable.
 */
export async function loadConfigs() {
  // POSTGRES_URI and REDIS_URI could potentially be loaded from a secret store
  return checkRequiredEnvs<AppConfig>(['APP_NAME', 'PORT', 'POSTGRES_URI', 'REDIS_URI']);
}
```

# src/main.ts

```ts
import { serve } from '@hono/node-server';
import { createDependencies } from './create-dependencies';
import { createApp } from './create-app';
import { loadConfigs } from './load-configs';

const configs = await loadConfigs();
const deps = createDependencies(configs);
const app = createApp(deps);

serve(
  {
    fetch: app.fetch,
    hostname: '127.0.0.1',
    port: parseInt(configs.PORT),
  },
  (ls) => {
    console.log(`Listening on http://${ls.address}:${ls.port}`);
  }
);
```

# src/middlewares/inject-dependencies.ts

```ts
import { defineMiddleware } from '@/utils/factories';

export const injectDependencies = (deps: Dependencies) =>
  defineMiddleware(async (c, next) => {
    c.set('deps', deps);

    await next();
  });
```

# src/utils/check-required-envs.ts

```ts
/**
 * Checks if all required environment variables are set.
 * Throws an error if any of them is missing.
 * @param keys - List of environment variables to check.
 * @returns the checked environment variables values in an object.
 */
export const checkRequiredEnvs = <T extends object>(keys: (keyof T)[]): T => {
  const result = {} as T;

  const missingEnvs = keys.filter((key) => {
    result[key] = (process.env as T)[key];
    return !result[key];
  });

  if (missingEnvs.length) {
    throw new Error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
  }

  return result;
};
```

# src/utils/create-rest-api.ts

```ts
import { type Env, Hono, type Schema } from 'hono';
import { errorHandler } from './error-handler';

/**
 * Creates a REST API instance with base config, middlewares and error handling.
 */
export const createRestApi = <E extends Env = Env, S extends Schema = Schema, BasePath extends string = '/'>(
  deps: Dependencies
) => new Hono<E, S, BasePath>({ strict: false }).onError(errorHandler(deps));
```

# src/utils/error-handler.ts

```ts
import { ErrorHandler } from 'hono/types';
import { Logger } from '../adapters/logger';
import { safeParseErrorContext } from './safe-parse-error-context';
import { headersToRecord } from './headers-to-record';

/**
 * Creates an error handler that logs the error with request contexts and attempts to return a meaningful failed response.
 */
export const errorHandler =
  (deps: { logger: Logger }): ErrorHandler =>
  (error, c) => {
    const parsedError = safeParseErrorContext(error);

    deps.logger.error(parsedError?.message, {
      request: {
        method: c.req.method,
        url: c.req.url,
        headers: headersToRecord(c.req.raw.headers),
      },
      response: {
        status: c.res.status,
        statusText: c.res.statusText,
        headers: headersToRecord(c.res.headers),
      },
      error: parsedError,
    });

    let message = 'Internal Server Error';
    if (c.res.status < 500 && parsedError?.message) message = parsedError.message;

    return c.json({ message }, c.res.status);
  };
```

# src/utils/factories.ts

```ts
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
```

# src/utils/headers-to-record.spec.ts

```ts
import { headersToRecord } from './headers-to-record';

describe('http', () => {
  test('should return an empty object when headers is undefined', () => {
    expect(headersToRecord()).toEqual({});
  });

  test('should return an empty object when headers is null', () => {
    expect(headersToRecord(null)).toEqual({});
  });

  test('should convert Headers instance to Record<string, string> with lowercase keys', () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer token');

    expect(headersToRecord(headers)).toEqual({
      'content-type': 'application/json',
      authorization: 'Bearer token',
    });
  });

  test('should handle empty Headers instance', () => {
    const headers = new Headers();

    expect(headersToRecord(headers)).toEqual({});
  });

  test('should handle Headers instance with duplicate keys', () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Type', 'text/plain');

    expect(headersToRecord(headers)).toEqual({
      'content-type': 'application/json, text/plain',
    });
  });

  test('should convert array of header tuples to Record<string, string> with lowercase keys', () => {
    const headers: HeadersInit = [
      ['Content-Type', 'application/json'],
      ['Authorization', 'Bearer token'],
    ];

    expect(headersToRecord(headers)).toEqual({
      'content-type': 'application/json',
      authorization: 'Bearer token',
    });
  });

  test('should handle empty array of header tuples', () => {
    const headers: HeadersInit = [];

    expect(headersToRecord(headers)).toEqual({});
  });

  test('should handle array of header tuples with duplicate keys', () => {
    const headers: HeadersInit = [
      ['Content-Type', 'application/json'],
      ['Content-Type', 'text/plain'],
    ];

    expect(headersToRecord(headers)).toEqual({
      'content-type': 'text/plain',
    });
  });

  test('should convert Record<string, string> input to Record<string, string> with lowercase keys', () => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    };

    expect(headersToRecord(headers)).toEqual({
      'content-type': 'application/json',
      authorization: 'Bearer token',
    });
  });

  test('should handle empty Record<string, string> input', () => {
    const headers: HeadersInit = {};

    expect(headersToRecord(headers)).toEqual({});
  });
});
```

# src/utils/headers-to-record.ts

```ts
/**
 * Convert headers to a plain serializable record.
 */
export const headersToRecord = (headers?: HeadersInit | null): Record<string, string> => {
  const headerRecord: Record<string, string> = {};

  if (!headers) return headerRecord;
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      headerRecord[key.toLowerCase()] = value;
    });
  } else if (Array.isArray(headers)) {
    for (const header of headers) {
      headerRecord[header[0].toLowerCase()] = header[1];
    }
  } else if (typeof headers === 'object') {
    for (const [key, value] of Object.entries(headers)) {
      headerRecord[key.toLowerCase()] = value;
    }
  }

  return headerRecord;
};
```

# src/utils/safe-parse-error-context.ts

```ts
import { toJson } from './to-json';

/**
 * Safely parse a thrown value.
 * @param error - The error to parse
 * @returns The parsed error context
 */
export const safeParseErrorContext = (error: unknown): Record<string, unknown> & { message: string } => {
  if (!error) return { message: '' };
  if (typeof error === 'string') return { message: error };
  if (typeof error === 'object') {
    const json = toJson(error) as Record<string, unknown> & { message: string };
    json.message = json.message ?? '';
    return json;
  }

  return { message: error.toString() };
};
```

# src/utils/to-json.ts

```ts
export type Primitive = string | number | boolean | bigint | symbol | undefined | null;

export type RecursiveToJSON<T> = T extends Primitive | ((...args: any[]) => any)
  ? T
  : T extends { toJSON: () => infer U }
    ? U
    : T extends Array<infer U>
      ? Array<RecursiveToJSON<U>>
      : { [K in keyof T]: RecursiveToJSON<T[K]> };

/**
 * Convert any value to a JSON-safe representation, keeping track of circular references.
 * Useful for extracting context from completely unexpected errors.
 */
export const toJson = <T>(value: T, seen = new WeakSet()): RecursiveToJSON<T> => {
  // Handle primitive types and functions directly
  if (value === null || typeof value !== 'object' || typeof value === 'function') {
    return value as RecursiveToJSON<T>;
  }

  // Check for circular references
  if (seen.has(value)) {
    return '[Circular]' as RecursiveToJSON<T>;
  }
  seen.add(value);

  // Use toJSON method if available
  if ('toJSON' in value && typeof value.toJSON === 'function') {
    return toJson(value.toJSON(), seen);
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item) => toJson(item, seen)) as RecursiveToJSON<T>;
  }

  // Handle objects
  const result: Record<string, unknown> = {};
  Object.getOwnPropertyNames(value).forEach((prop) => {
    if (prop.startsWith('_')) return;
    const descriptor = Object.getOwnPropertyDescriptor(value, prop);
    if (descriptor && descriptor.value) {
      result[prop] = toJson(descriptor.value, seen);
    }
  });

  if (value instanceof Error) {
    result['name'] = value.name;
  }

  return result as RecursiveToJSON<T>;
};
```

# package.json/package.json

```json
{
  "name": "seat-scheduler-test",
  "version": "0.0.1",
  "author": "me@dannyfranca.com",
  "private": true,
  "type": "module",
  "scripts": {
    "type-check": "tsc --noEmit",
    "build": "vite build",
    "dev": "dotenv -- tsx watch ./src/main.ts"
  },
  "devDependencies": {
    "@hono/node-server": "1.11.1",
    "@hono/zod-validator": "0.2.1",
    "@types/node": "20.12.11",
    "@typescript-eslint/eslint-plugin": "7.8.0",
    "@typescript-eslint/parser": "7.8.0",
    "@vitest/coverage-istanbul": "1.6.0",
    "eslint": "8.57.0",
    "eslint-config-prettier": "9.1.0",
    "eslint-plugin-import": "2.29.1",
    "eslint-plugin-prettier": "5.1.3",
    "eslint-plugin-unused-imports": "3.2.0",
    "hono": "3.12.6",
    "prettier": "3.2.5",
    "tslib": "2.6.2",
    "tsup": "8.0.2",
    "tsx": "4.9.3",
    "typescript": "5.4.5",
    "vite": "5.3.3",
    "vite-tsconfig-paths": "4.3.2",
    "vitest": "1.6.0",
    "zod": "3.23.8"
  }
}
```

# vite.config.ts/vite.config.ts

```ts
/// <reference types='vitest' />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  ssr: {
    target: 'node',
    noExternal: true,
  },
  build: {
    ssr: true,
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      input: 'src/main.ts',
    },
  },
  test: {
    globals: true,
    clearMocks: true,
    environment: 'node',
    coverage: {
      provider: 'istanbul',
    },
    include: ['src/**/*.{test,spec}.{js,mjs,ts,mts,jsx,tsx}'],
  },
});
```

