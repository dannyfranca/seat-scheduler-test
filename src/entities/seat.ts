import { UniqueId } from './unique-id.vo';

export type SeatStatus = 'available' | 'held' | 'reserved';

export interface SeatJSON {
  id: string;
  status: SeatStatus;
  userId: string | null;
  holdExpiresAt: string | null;
}

export class Seat {
  private readonly id: UniqueId;
  private status: SeatStatus;
  private userId: UniqueId | null;
  private holdExpiresAt: Date | null;

  private constructor(id: string, status: SeatStatus, userId: string | null, holdExpiresAt: Date | null) {
    this.id = new UniqueId(id);
    this.status = status;
    this.userId = userId ? new UniqueId(userId) : null;
    this.holdExpiresAt = holdExpiresAt;
  }

  static create(): Seat {
    return new Seat(UniqueId.create().toString(), 'available', null, null);
  }
  static reconstruct(
    id: string,
    status: 'available' | 'held' | 'reserved',
    userId: string | null,
    holdExpiresAt: Date | null
  ): Seat {
    return new Seat(id, status, userId, holdExpiresAt);
  }

  hold(userId: UniqueId): void {
    if (this.status !== 'available') {
      throw new Error('Seat is not available for holding');
    }
    this.status = 'held';
    this.userId = userId;
    this.holdExpiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds from now;
  }

  reserve(userId: UniqueId): void {
    if (this.status !== 'held' || !this.userId?.equals(userId)) {
      throw new Error('Seat is not held by the user');
    }
    if (this.isHoldExpired()) {
      throw new Error('Hold has expired');
    }
    this.status = 'reserved';
    this.holdExpiresAt = null;
  }

  release(): void {
    this.status = 'available';
    this.userId = null;
    this.holdExpiresAt = null;
  }

  isHoldExpired(): boolean {
    return this.status === 'held' && this.holdExpiresAt !== null && this.holdExpiresAt < new Date();
  }

  getStatus(): string {
    return this.status;
  }

  getId(): UniqueId {
    return this.id;
  }

  toJSON(): SeatJSON {
    return {
      id: this.id.toString(),
      status: this.status,
      userId: this.userId?.toString() || null,
      holdExpiresAt: this.holdExpiresAt?.toISOString() || null,
    };
  }
}
