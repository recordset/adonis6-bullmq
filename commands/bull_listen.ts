import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class BullListen extends BaseCommand {
  public static commandName = 'bull:listen'
  public static description = 'Listen to Bull queues and process jobs'
  
  static options: CommandOptions = {
    allowUnknownFlags: true,
  }

  @args.string({ description: 'Queue name to listen to', required: false })
  declare queueName?: string

  @flags.array({ description: 'Specific queues to listen to' })
  declare queues: string[]

  @flags.number({ description: 'Number of concurrent workers', default: 1 })
  declare concurrency: number

  @flags.boolean({ description: 'Run in watch mode for development' })
  declare watch: boolean

  async run() {
    const { default: BullMQManager } = await import('../src/bullmq_manager.js')
    
    // Get BullMQ manager from container
    const bullmq = await this.app.container.make(BullMQManager)
    const logger = await this.app.container.make('logger')

    // Determine which queues to listen to
    const queuesToListen = this.queues?.length 
      ? this.queues 
      : this.queueName 
        ? [this.queueName] 
        : ['default']

    logger.info(`Starting Bull workers for queues: ${queuesToListen.join(', ')}`)

    // Start workers for each queue
    for (const queueName of queuesToListen) {
      try {
        const worker = bullmq.worker(queueName, async (job: any) => {
          logger.info(`Processing job ${job.id} from queue ${queueName}`)
          
          // Load and execute the job
          const jobData = job.data
          const jobType = jobData.__jobType || 'unknown'
          
          try {
            // Dynamically import the job class
            const jobModule = await import(`../../../app/jobs/${jobType}.js`)
            const JobClass = jobModule.default
            
            if (!JobClass) {
              throw new Error(`Job class ${jobType} not found`)
            }
            
            const jobInstance = new JobClass()
            const result = await jobInstance.handle({
              data: jobData,
              job: job,
            })
            
            logger.info(`Job ${job.id} completed successfully`)
            return result
          } catch (error: any) {
            logger.error(`Job ${job.id} failed: ${error.message}`)
            throw error
          }
        }, {
          concurrency: this.concurrency,
        })

        logger.info(`Worker started for queue: ${queueName}`)
        
        // Graceful shutdown
        process.on('SIGTERM', async () => {
          logger.info('Shutting down Bull workers...')
          await bullmq.shutdown()
          process.exit(0)
        })

        process.on('SIGINT', async () => {
          logger.info('Shutting down Bull workers...')
          await bullmq.shutdown()
          process.exit(0)
        })

      } catch (error: any) {
        logger.error(`Failed to start worker for queue ${queueName}: ${error.message}`)
      }
    }

    // Keep the process running
    logger.info('Bull workers are running. Press Ctrl+C to stop.')
    
    // Prevent the process from exiting
    await new Promise(() => {})
  }
}
