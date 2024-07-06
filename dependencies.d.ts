import { Logger } from '@/adapters/logger';
import { LifecycleManager } from '@/adapters/lifecycle-manager';
import { CreateEvent } from '@/usecases/create-event';

declare global {
  interface Dependencies {
    logger: Logger;
    lifecycleManager: LifecycleManager;
    createEvent: CreateEvent;
  }
}

export {};
