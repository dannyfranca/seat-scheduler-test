import { SeatRepository } from '@/database';
import { UniqueId } from '@/entities';

export class ReserveSeat {
  constructor(private readonly seatRepo: SeatRepository) {}

  async execute({ userId, seatId }: Input): Promise<Output> {
    const seat = await this.seatRepo.findById(new UniqueId(seatId));
    if (!seat) throw new Error('Seat not found');
    seat.reserve(new UniqueId(userId));
    await this.seatRepo.reserve(seat);
    // TODO: handle errors on update atomic
  }
}

interface Input {
  userId: string;
  seatId: string;
}

type Output = void;
