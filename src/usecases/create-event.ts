import { EventRepository } from '@/database/event-repository';
import { Event } from '@/entities';

export class CreateEvent {
  constructor(private readonly eventRepo: EventRepository) {}

  async execute({ totalSeats }: Input): Promise<Output> {
    const event = Event.create(totalSeats);
    await this.eventRepo.create(event);
    return {
      eventId: event.getId().toString(),
    };
  }
}

interface Input {
  totalSeats: number;
}

interface Output {
  eventId: string;
}
