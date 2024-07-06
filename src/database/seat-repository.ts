import { Seat, UniqueId } from '@/entities';

export interface SeatRepository {
  create(seat: Seat): Promise<void>;
  findById(id: UniqueId): Promise<Seat | null>;
  findByEventId(eventId: UniqueId): Promise<Seat[]>;
  findAvailableByEventId(eventId: UniqueId): Promise<Seat[]>;
  updateStatus(
    id: UniqueId,
    status: 'available' | 'held' | 'reserved',
    userId?: UniqueId,
    holdExpiresAt?: Date
  ): Promise<void>;
}
