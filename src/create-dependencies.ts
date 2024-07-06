import pg from 'pg';
import { LifecycleManager } from './adapters/lifecycle-manager';
import { ConsoleLogger } from './adapters/logger/console-logger';
import { LogLevel } from './adapters/logger/base-logger';
import { CreateEvent } from './usecases/create-event';
import { PostgresEventRepository } from './database/event-repository.postgres';

/**
 * Creates a container that holds all dependencies for the application.
 */
export const createDependencies = (conf: AppConfig): Dependencies => {
  const appName = conf.APP_NAME;
  const logger = new ConsoleLogger(LogLevel.INFO, { app: appName });
  const lifecycleManager = new LifecycleManager();

  const pgClient = new pg.Client({ connectionString: conf.POSTGRES_URI });
  lifecycleManager.addBootHook(() => pgClient.connect());
  lifecycleManager.addShutdownHook(() => pgClient.end());

  const eventRepo = new PostgresEventRepository(pgClient);

  const createEvent = new CreateEvent(eventRepo);

  return {
    logger,
    lifecycleManager,
    createEvent,
  };
};
