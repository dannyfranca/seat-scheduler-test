import { Client } from 'pg';

export class ReleaseExpiredHolds {
  constructor(private readonly client: Client) {}

  async execute() {
    await this.client.query(`
        UPDATE seats
        SET status = 'available', user_id = NULL, hold_expires_at = NULL
        WHERE status = 'held' AND hold_expires_at <= CURRENT_TIMESTAMP
      `);
  }
}
