type Hook = () => Promise<void> | void;

export class LifecycleManager {
  private bootHooks: Hook[] = [];
  private shutdownHooks: Hook[] = [];
  private isShuttingDown: boolean = false;
  private ongoingExecutions: number = 0;

  addBootHook(hook: Hook): void {
    this.bootHooks.push(hook);
  }

  addShutdownHook(hook: Hook): void {
    this.shutdownHooks.push(hook);
  }

  async boot(): Promise<void> {
    console.log('Starting boot process...');
    for (const hook of this.bootHooks) {
      await hook();
    }
    console.log('Boot process completed.');
  }

  async shutdown(): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    console.log('Received shutdown signal. Starting graceful shutdown...');

    await this.waitForOngoingRequests();

    for (const hook of this.shutdownHooks.reverse()) {
      await hook();
    }

    console.log('Graceful shutdown complete.');
    process.exit(0);
  }

  private async waitForOngoingRequests(): Promise<void> {
    return new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.ongoingExecutions === 0) {
          clearInterval(checkInterval);
          resolve();
        } else {
          console.log(`Waiting for ${this.ongoingExecutions} ongoing requests to complete...`);
        }
      }, 1000);
    });
  }

  isInShutdownMode(): boolean {
    return this.isShuttingDown;
  }

  trackRequest(): () => void {
    this.ongoingExecutions++;
    return () => {
      this.ongoingExecutions--;
    };
  }

  getOngoingRequestsCount(): number {
    return this.ongoingExecutions;
  }
}
