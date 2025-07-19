import type { Job } from 'bullmq'
import type { JobData, JobResult, JobContext } from '../types.js'

/**
 * Base Job class that all jobs should extend
 */
export abstract class BaseJob<T = JobData, R = JobResult> {
  /**
   * The unique identifier for this job type
   */
  public static get jobName(): string {
    return this.name
  }

  /**
   * Handle the job execution
   */
  abstract handle(context: JobContext): Promise<R>

  /**
   * Handle job failure (optional)
   */
  async failed(job: Job<T, R>, error: Error): Promise<void> {
    // Override this method to handle job failures
    console.error(`Job ${job.id} failed:`, error.message)
  }

  /**
   * Get job options (optional)
   */
  get jobOptions() {
    return {
      removeOnComplete: 10,
      removeOnFail: 5,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    }
  }
}
