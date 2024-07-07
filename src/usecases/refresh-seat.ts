import { SeatRepository } from '@/database';
import { UniqueId } from '@/entities';

export class RefreshSeat {
  constructor(private readonly seatRepo: SeatRepository) {}

  async execute({ userId, seatId }: Input): Promise<Output> {
    const seat = await this.seatRepo.findById(new UniqueId(seatId));
    if (!seat) throw new Error('Seat not found');
    seat.refresh(new UniqueId(userId));
    await this.seatRepo.refresh(seat);
    // TODO: handle errors on update atomic
  }
}

interface Input {
  userId: string;
  seatId: string;
}

type Output = void;
