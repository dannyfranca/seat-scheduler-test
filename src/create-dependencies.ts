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
