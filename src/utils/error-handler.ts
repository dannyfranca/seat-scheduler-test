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
    //   const status = inferHttpStatusCodeFromError(error);
    const status = 500;
    const isUnexpectedError = false;
    const parsedError = safeParseErrorContext(error);

    let message = 'Internal Server Error';
    if (status < 500 && parsedError?.message) message = parsedError.message;
    const body = { message };

    // TODO: Log error for only non-expected errors. With custom errors implemented, it becomes easier to track what should be logged as error and notify a generic message as response and what should not be logged as error and infer the message to the user.
    if (isUnexpectedError) {
      deps.logger.error(parsedError?.message, {
        request: {
          method: c.req.method,
          url: c.req.url,
          headers: headersToRecord(c.req.raw.headers),
        },
        response: {
          status,
          body,
          headers: headersToRecord(c.res.headers),
        },
        error: parsedError,
      });

      return c.json({ message: 'Internal Server Error' }, 500);
    }

    return c.json(body, status);
  };
