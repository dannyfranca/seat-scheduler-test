import { Seat, UniqueId } from '@/entities';

export interface SeatRepository {
  findById(id: UniqueId): Promise<Seat | null>;
  findAvailableByEventId(eventId: UniqueId): Promise<{ id: string }[]>;
  hold(seat: Seat): Promise<void>;
  reserve(seat: Seat): Promise<void>;
  release(seat: Seat): Promise<void>;
  refresh(seat: Seat): Promise<void>;
}
