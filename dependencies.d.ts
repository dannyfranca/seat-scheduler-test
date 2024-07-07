import { Logger } from '@/adapters/logger';
import { LifecycleManager } from '@/adapters/lifecycle-manager';
import { CreateEvent } from '@/usecases/create-event';
import { ListAvailableSeats } from '@/usecases/list-available-seats';
import { HoldSeat } from '@/usecases/hold-seat';

declare global {
  interface Dependencies {
    logger: Logger;
    lifecycleManager: LifecycleManager;
    createEvent: CreateEvent;
    listAvailableSeats: ListAvailableSeats;
    holdSeat: HoldSeat;
  }
}

export {};
