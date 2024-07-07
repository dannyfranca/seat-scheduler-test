import { Event, UniqueId } from '@/entities';

export interface EventRepository {
  create(event: Event): Promise<void>;
  findById(id: UniqueId): Promise<Event | null>;
  findAll(): Promise<{ id: string }[]>; // Speaking of design, this annotation would be more suited in a DAO than a Repository. Opting to keep it simple for this task.
}
