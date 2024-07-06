import { Event, UniqueId } from '@/entities';

export interface EventRepository {
  create(event: Event): Promise<void>;
  findById(id: UniqueId): Promise<Event | null>;
  findAll(): Promise<Event[]>;
}
