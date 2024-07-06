import { Seat, UniqueId } from '@/entities';

export interface SeatRepository {
  findById(id: UniqueId): Promise<Seat | null>;
  updateAtomic(seat: Seat): Promise<void>;
}
