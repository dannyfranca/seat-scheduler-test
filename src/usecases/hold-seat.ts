import { SeatRepository } from '@/database';
import { UniqueId } from '@/entities';

export class HoldSeat {
  constructor(private readonly seatRepo: SeatRepository) {}

  async execute({ userId, seatId }: Input): Promise<Output> {
    const seat = await this.seatRepo.findById(new UniqueId(seatId));
    if (!seat) throw new Error('Seat not found');
    seat.hold(new UniqueId(userId));
    await this.seatRepo.updateAtomic(seat);
    // TODO: handle errors on update atomic
    return {
      holdExpiresAt: seat.getHoldExpiration()!.toISOString(),
    };
  }
}

interface Input {
  userId: string;
  seatId: string;
}

type Output = {
  holdExpiresAt: string; // ISO 8601 timestamp
};
