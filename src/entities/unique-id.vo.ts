import { v4, validate } from 'uuid';

export class UniqueId {
  private readonly id: string;

  constructor(id: string) {
    if (!UniqueId.isValidUUID(id)) {
      throw new Error('Invalid UUID format');
    }
    this.id = id;
  }

  static create(): UniqueId {
    return new UniqueId(UniqueId.generateUUIDv4());
  }

  private static generateUUIDv4(): string {
    return v4();
  }

  static isValidUUID(uuid: string): boolean {
    return validate(uuid);
  }

  toString(): string {
    return this.id;
  }

  equals(other: UniqueId): boolean {
    return this.id === other.id;
  }
}
