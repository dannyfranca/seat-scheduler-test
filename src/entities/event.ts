import { Seat, SeatJSON } from './seat';
import { UniqueId } from './unique-id.vo';

export class Event {
  private readonly id: UniqueId;
  private readonly seats: Map<string, Seat>;

  private constructor(id: string, seats: Map<string, Seat>) {
    this.id = new UniqueId(id);
    this.seats = seats;
  }

  static create(totalSeats: number): Event {
    if (totalSeats < 10 || totalSeats > 1000) {
      throw new Error('Events must have between 10 and 1000 seats');
    }
    const seats = new Map<string, Seat>();
    for (let i = 0; i < totalSeats; i++) {
      const seatId = Seat.create();
      seats.set(seatId.toString(), seatId);
    }
    return new Event(UniqueId.create().toString(), seats);
  }

  static reconstruct(id: string, seatData: Array<SeatJSON>): Event {
    const seats = new Map<string, Seat>();
    seatData.forEach((seat) => {
      const holdExpiresAt = seat.holdExpiresAt ? new Date(seat.holdExpiresAt) : null;
      seats.set(seat.id, Seat.reconstruct(seat.id, seat.status, seat.userId, holdExpiresAt));
    });
    return new Event(id, seats);
  }

  holdSeat(seatId: UniqueId, userId: UniqueId): void {
    const seat = this.seats.get(seatId.toString());
    if (!seat) {
      throw new Error('Seat not found');
    }
    seat.hold(userId);
  }

  reserveSeat(seatId: UniqueId, userId: UniqueId): void {
    const seat = this.seats.get(seatId.toString());
    if (!seat) {
      throw new Error('Seat not found');
    }
    seat.reserve(userId);
  }

  releaseSeat(seatId: UniqueId): void {
    const seat = this.seats.get(seatId.toString());
    if (!seat) {
      throw new Error('Seat not found');
    }
    seat.release();
  }

  getAvailableSeats(): UniqueId[] {
    return Array.from(this.seats.values())
      .filter((seat) => seat.getStatus() === 'available')
      .map((seat) => seat.getId());
  }

  getId(): UniqueId {
    return this.id;
  }

  getSeats() {
    return Array.from(this.seats.values());
  }

  getTotalSeats(): number {
    return this.seats.size;
  }

  toJSON() {
    return {
      id: this.id.toString(),
      seats: Array.from(this.seats.values()).map((seat) => seat.toJSON()),
    };
  }
}
