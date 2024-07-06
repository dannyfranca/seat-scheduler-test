import { Logger } from '@/adapters/logger';
import { LifecycleManager } from '@/adapters/lifecycle-manager';

declare global {
  interface Dependencies {
    logger: Logger;
    lifecycleManager: LifecycleManager;
  }
}

export {};
