import { Logger } from '@/adapters/logger';
import { LifecycleManager } from '@/adapters/lifecycle-manager';
import { CreateEvent } from '@/usecases/create-event';
import { ListAvailableSeats } from '@/usecases/list-available-seats';

declare global {
  interface Dependencies {
    logger: Logger;
    lifecycleManager: LifecycleManager;
    createEvent: CreateEvent;
    listAvailableSeats: ListAvailableSeats;
  }
}

export {};
