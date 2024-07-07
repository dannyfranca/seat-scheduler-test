import pg from 'pg';
import { LifecycleManager } from './adapters/lifecycle-manager';
import { ConsoleLogger } from './adapters/logger/console-logger';
import { LogLevel } from './adapters/logger/base-logger';
import { CreateEvent } from './usecases/create-event';
import { PostgresEventRepository } from './database/event-repository.postgres';
import { PostgresSeatRepository } from './database/seat-repository.postgres';
import { ListAvailableSeats } from './usecases/list-available-seats';
import { HoldSeat } from './usecases/hold-seat';
import { ReserveSeat } from './usecases/reserve-seat';
import { RefreshSeat } from './usecases/refresh-seat';
import { migrate } from './migrate';
import { ReleaseExpiredHolds } from './usecases/release-expired-holds';

/**
 * Creates a container that holds all dependencies for the application.
 */
export const createDependencies = (conf: AppConfig): Dependencies => {
  const appName = conf.APP_NAME;
  const logger = new ConsoleLogger(LogLevel.INFO, { app: appName });
  const lifecycleManager = new LifecycleManager();

  const pgClient = new pg.Client({ connectionString: conf.POSTGRES_URI });
  lifecycleManager.addBootHook(() => pgClient.connect());
  lifecycleManager.addBootHook(() => migrate(pgClient));
  lifecycleManager.addShutdownHook(() => pgClient.end());

  const eventRepo = new PostgresEventRepository(pgClient);
  const seatRepo = new PostgresSeatRepository(pgClient);

  const createEvent = new CreateEvent(eventRepo);
  const listAvailableSeats = new ListAvailableSeats(seatRepo);
  const holdSeat = new HoldSeat(seatRepo);
  const reserveSeat = new ReserveSeat(seatRepo);
  const refreshSeat = new RefreshSeat(seatRepo);
  const releaseExpiredHolds = new ReleaseExpiredHolds(pgClient);

  return {
    logger,
    lifecycleManager,
    createEvent,
    listAvailableSeats,
    holdSeat,
    reserveSeat,
    refreshSeat,
    releaseExpiredHolds,
  };
};
