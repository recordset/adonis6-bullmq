import { Queue, Worker, QueueEvents, Job } from 'bullmq'
import { inject } from '@adonisjs/core'
import type { Logger } from '@adonisjs/core/logger'
import type { BullMQConfig, JobData, JobResult } from './types.js'

@inject()
export default class BullMQManager {
  private queues: Map<string, Queue> = new Map()
  private workers: Map<string, Worker> = new Map()
  private queueEvents: Map<string, QueueEvents> = new Map()

  constructor(
    private config: BullMQConfig,
    private logger: Logger
  ) {}

  /**
   * Create or get a queue instance
   */
  queue<T = JobData, R = JobResult>(name: string) {
    if (!this.queues.has(name)) {
      const queue = new Queue<T, R>(name, {
        connection: this.config,
        defaultJobOptions: this.config.defaultJobOptions,
      })
      this.queues.set(name, queue)
    }
    return this.queues.get(name)!
  }

  /**
   * Create or get a worker instance
   */
  worker<T = JobData, R = JobResult>(
    name: string,
    processor: string | ((job: Job<T, R>) => Promise<R>),
    options: any = {}
  ) {
    if (!this.workers.has(name)) {
      const worker = new Worker<T, R>(name, processor, {
        connection: this.config,
        ...options,
      })

      // Add error handling
      worker.on('error', (error) => {
        this.logger.error(`Worker ${name} error: ${error.message}`)
      })

      worker.on('failed', (job, error) => {
        this.logger.error(`Job ${job?.id} failed in queue ${name}: ${error.message}`)
      })

      worker.on('completed', (job) => {
        this.logger.info(`Job ${job.id} completed in queue ${name}`)
      })

      this.workers.set(name, worker)
    }
    return this.workers.get(name)!
  }

  /**
   * Create or get queue events instance
   */
  events(name: string) {
    if (!this.queueEvents.has(name)) {
      const queueEvents = new QueueEvents(name, {
        connection: this.config,
      })
      this.queueEvents.set(name, queueEvents)
    }
    return this.queueEvents.get(name)!
  }

  /**
   * Get all queues
   */
  getQueues() {
    return Array.from(this.queues.values())
  }

  /**
   * Get all workers
   */
  getWorkers() {
    return Array.from(this.workers.values())
  }

  /**
   * Shutdown all connections
   */
  async shutdown() {
    // Close all workers
    for (const worker of this.workers.values()) {
      await worker.close()
    }

    // Close all queue events
    for (const queueEvents of this.queueEvents.values()) {
      await queueEvents.close()
    }

    // Close all queues
    for (const queue of this.queues.values()) {
      await queue.close()
    }

    // Clear maps
    this.workers.clear()
    this.queueEvents.clear()
    this.queues.clear()
  }
}
