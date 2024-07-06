import { ServerType } from '@hono/node-server/dist/types';
import { LifecycleManager } from './adapters/lifecycle-manager';

export function setupGracefulShutdown(server: ServerType, lifecycleManager: LifecycleManager) {
  // Listen for termination signals
  process.on('SIGTERM', () => gracefulShutdown(server, lifecycleManager));
  process.on('SIGINT', () => gracefulShutdown(server, lifecycleManager));
}

// Graceful shutdown function
function gracefulShutdown(server: ServerType, lifecycleManager: LifecycleManager) {
  server.close(() => {
    console.log('Server stopped accepting new connections.');
    lifecycleManager.shutdown();
  });
}
