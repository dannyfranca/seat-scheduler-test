import { Logger } from '@/adapters/logger';
import { LifecycleManager } from '@/adapters/lifecycle-manager';
import { CreateEvent } from '@/usecases/create-event';
import { ListAvailableSeats } from '@/usecases/list-available-seats';
import { HoldSeat } from '@/usecases/hold-seat';
import { ReserveSeat } from '@/usecases/reserve-seat';
import { RefreshSeat } from '@/usecases/refresh-seat';
import { ReleaseExpiredHolds } from '@/usecases/release-expired-holds';

declare global {
  interface Dependencies {
    logger: Logger;
    lifecycleManager: LifecycleManager;
    createEvent: CreateEvent;
    listAvailableSeats: ListAvailableSeats;
    holdSeat: HoldSeat;
    reserveSeat: ReserveSeat;
    refreshSeat: RefreshSeat;
    releaseExpiredHolds: ReleaseExpiredHolds;
  }
}

export {};
