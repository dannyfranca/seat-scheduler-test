import cron from 'node-cron';

type ScheduledTask = () => Promise<void> | void;

export class Scheduler {
  private scheduledTasks: Map<string, cron.ScheduledTask> = new Map();

  scheduleTask(name: string, cronExpression: string, task: ScheduledTask): void {
    const scheduledTask = cron.schedule(
      cronExpression,
      async () => {
        try {
          await task();
        } catch (error) {
          console.error(`Error executing scheduled task ${name}:`, error);
        }
      },
      {
        scheduled: false, // Don't start the task immediately
      }
    );
    this.scheduledTasks.set(name, scheduledTask);
  }

  start(): void {
    console.log('Starting all scheduled tasks...');
    for (const [name, task] of this.scheduledTasks) {
      task.start();
      console.log(`Started scheduled task: ${name}`);
    }
  }

  stop(): void {
    console.log('Stopping all scheduled tasks...');
    for (const [name, task] of this.scheduledTasks) {
      task.stop();
      console.log(`Stopped scheduled task: ${name}`);
    }
  }
}
