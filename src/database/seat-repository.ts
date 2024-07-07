import { Seat, UniqueId } from '@/entities';

export interface SeatRepository {
  findById(id: UniqueId): Promise<Seat | null>;
  findAvailableByEventId(eventId: UniqueId): Promise<{ id: string }[]>;
  /**
   * Updates the seat handling potential race conditions with conditional updates.
   */
  updateAtomic(seat: Seat): Promise<void>;
}
