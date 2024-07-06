import { LogLevel, Logger } from './logger';

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
