import { SeatRepository } from '@/database';
import { UniqueId } from '@/entities';

export class ListAvailableSeats {
  constructor(private readonly seatRepo: SeatRepository) {}

  async execute({ eventId }: Input): Promise<Output> {
    const results = await this.seatRepo.findAvailableByEventId(new UniqueId(eventId));
    return {
      availableSeats: results.map(({ id }) => ({ seatId: id })),
    };
  }
}

interface Input {
  eventId: string;
}

interface Output {
  availableSeats: Array<{
    seatId: string;
  }>;
}
