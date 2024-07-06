import { Seat, UniqueId } from '@/entities';

export interface SeatRepository {
  findById(id: UniqueId): Promise<Seat | null>;
  update(seat: Seat): Promise<void>;
}
