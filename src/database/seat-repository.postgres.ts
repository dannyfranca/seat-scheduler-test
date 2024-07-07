import { Client } from 'pg';
import { SeatRepository } from './seat-repository';
import { Seat, UniqueId } from '@/entities';

export class PostgresSeatRepository implements SeatRepository {
  constructor(private readonly client: Client) {}

  async findById(id: UniqueId): Promise<Seat | null> {
    const result = await this.client.query('SELECT * FROM seats WHERE id = $1', [id.toString()]);
    if (result.rows.length === 0) {
      return null;
    }
    const seat = result.rows[0];
    return Seat.reconstruct(seat.id, seat.status, seat.user_id, seat.hold_expires_at);
  }

  async findAvailableByEventId(eventId: UniqueId): Promise<{ id: string }[]> {
    const result = await this.client.query('SELECT id FROM seats WHERE event_id = $1 AND status = $2', [
      eventId.toString(),
      'available',
    ]);
    return result.rows;
  }

  private updateAtomic(seat: Seat, extraCondition: string) {
    const { id, userId, status, holdExpiresAt } = seat.toJSON();

    return this.client.query(
      `UPDATE seats
        SET status = $1, user_id = $2, hold_expires_at = $3
        WHERE id = $4 ${extraCondition}`,
      [status, userId, holdExpiresAt, id]
    );
  }

  async hold(seat: Seat): Promise<void> {
    const results = await this.updateAtomic(seat, "AND status = 'available'");
    if (results.rowCount === 0) {
      throw new Error('Seat is not available for holding');
    }
  }

  async reserve(seat: Seat): Promise<void> {
    const results = await this.updateAtomic(
      seat,
      "AND status = 'held' AND user_id = $2 AND hold_expires_at > CURRENT_TIMESTAMP"
    );
    if (results.rowCount === 0) {
      throw new Error('Seat is not held by the user or hold has expired');
    }
  }

  async release(seat: Seat): Promise<void> {
    const results = await this.updateAtomic(seat, "AND status = 'held' AND hold_expires_at <= CURRENT_TIMESTAMP");
    if (results.rowCount === 0) {
      throw new Error('Only expired held seats can be released');
    }
  }

  async refresh(seat: Seat): Promise<void> {
    const results = await this.updateAtomic(
      seat,
      "AND status = 'held' AND user_id = $2 AND hold_expires_at > CURRENT_TIMESTAMP"
    );
    if (results.rowCount === 0) {
      throw new Error('Seat is not held by the user or hold has expired');
    }
  }
}
