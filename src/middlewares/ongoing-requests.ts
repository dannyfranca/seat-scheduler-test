import { LifecycleManager } from '@/adapters/lifecycle-manager';
import { defineMiddleware } from '@/utils/factories';

export const onGoingRequests = (lifecycleManager: LifecycleManager) =>
  defineMiddleware(async (c, next) => {
    const onRequestFinished = lifecycleManager.trackRequest();
    await next();
    onRequestFinished();
  });
