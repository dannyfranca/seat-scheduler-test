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
