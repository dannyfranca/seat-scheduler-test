import { ErrorHandler } from 'hono/types';
import { Logger } from '../adapters/logger/base-logger';
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
