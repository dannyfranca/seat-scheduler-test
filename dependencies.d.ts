import { Logger } from '@/adapters/logger';

declare global {
  interface Dependencies {
    logger: Logger;
  }
}

export {};
