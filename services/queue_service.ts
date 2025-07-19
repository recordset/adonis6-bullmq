import type { Job } from 'bullmq'
import type BullMQManager from '../src/bullmq_manager.js'
import type { JobData } from '../src/types.js'

export default class QueueService {
  constructor(private bullmq: BullMQManager) {}

  /**
   * Dispatch a job to a queue
   */
  async dispatch<T = JobData>(
    queueName: string,
    jobType: string,
    data: T,
    options: any = {}
  ): Promise<Job> {
    const queue = this.bullmq.queue(queueName)
    
    const jobData = {
      ...data,
      __jobType: jobType,
    }

    return await queue.add(jobType, jobData, options)
  }

  /**
   * Dispatch a job to the default queue
   */
  async dispatchToDefault<T = JobData>(
    jobType: string,
    data: T,
    options: any = {}
  ): Promise<Job> {
    return this.dispatch('default', jobType, data, options)
  }

  /**
   * Schedule a job to run later
   */
  async schedule<T = JobData>(
    queueName: string,
    jobType: string,
    data: T,
    delay: number,
    options: any = {}
  ): Promise<Job> {
    return this.dispatch(queueName, jobType, data, {
      ...options,
      delay,
    })
  }

  /**
   * Schedule a job on default queue
   */
  async scheduleOnDefault<T = JobData>(
    jobType: string,
    data: T,
    delay: number,
    options: any = {}
  ): Promise<Job> {
    return this.schedule('default', jobType, data, delay, options)
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(queueName: string) {
    const queue = this.bullmq.queue(queueName)
    return {
      waiting: await queue.getWaiting(),
      active: await queue.getActive(),
      completed: await queue.getCompleted(),
      failed: await queue.getFailed(),
      delayed: await queue.getDelayed(),
    }
  }

  /**
   * Clean a queue
   */
  async cleanQueue(
    queueName: string,
    grace: number = 0,
    limit: number = 100,
    type: 'completed' | 'wait' | 'active' | 'delayed' | 'failed' = 'completed'
  ) {
    const queue = this.bullmq.queue(queueName)
    return await queue.clean(grace, limit, type)
  }

  /**
   * Pause a queue
   */
  async pauseQueue(queueName: string) {
    const queue = this.bullmq.queue(queueName)
    return await queue.pause()
  }

  /**
   * Resume a queue
   */
  async resumeQueue(queueName: string) {
    const queue = this.bullmq.queue(queueName)
    return await queue.resume()
  }
}
