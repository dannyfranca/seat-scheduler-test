import { Client } from 'pg';
import { EventRepository } from './event-repository';
import { Event, SeatJSON, UniqueId } from '@/entities';

export class PostgresEventRepository implements EventRepository {
  constructor(private readonly client: Client) {}

  async create(event: Event): Promise<void> {
    try {
      await this.client.query('BEGIN');

      // Insert the event
      await this.client.query('INSERT INTO events (id, total_seats) VALUES ($1, $2)', [
        event.getId().toString(),
        event.getTotalSeats(),
      ]);

      // Prepare bulk insert for seats
      const seatValues = event
        .getSeats()
        .map((seat) => `('${seat.getId().toString()}', '${event.getId().toString()}', 'available')`)
        .join(',');

      // Bulk insert all seats
      await this.client.query(`
        INSERT INTO seats (id, event_id, status)
        VALUES ${seatValues}
      `);

      await this.client.query('COMMIT');
    } catch (error) {
      await this.client.query('ROLLBACK');
      throw error;
    }
  }

  async findById(id: UniqueId): Promise<Event | null> {
    const result = await this.client.query('SELECT * FROM events WHERE id = $1', [id.toString()]);
    if (result.rows.length === 0) {
      return null;
    }
    const event = result.rows[0];
    const seats = await this.client.query('SELECT * FROM seats WHERE event_id = $1', [id.toString()]);
    return Event.reconstruct(
      event.id,
      seats.rows.map(
        (seat): SeatJSON => ({
          id: seat.id,
          userId: seat.user_id ?? null,
          status: seat.status,
          holdExpiresAt: seat.hold_expires_at,
        })
      )
    );
  }

  async findAll(): Promise<{ id: string }[]> {
    const result = await this.client.query('SELECT event_id as id FROM events');
    return result.rows;
  }
}
