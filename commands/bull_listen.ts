import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import BullMQManager from '../src/bullmq_manager.js'
import type { BullMQConfig } from '../src/types.js'
import { readdir } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

export default class BullListen extends BaseCommand {
  public static commandName = 'bull:listen'
  public static description = 'Listen to Bull queues and process jobs'
  static options: CommandOptions = { startApp: true, staysAlive: true }
  @flags.array({ description: 'Queue names to listen (comma separated)' })
  declare queue: string[] | undefined

  async run() {
    const logger = await this.app.container.make('logger')
    const bullmq = await this.app.container.make(BullMQManager)

    // Convert case: array with single element containing comma
    if (this.queue && Array.isArray(this.queue) && this.queue.length === 1 && this.queue[0].includes(',')) {
      this.queue = this.queue[0].split(',').map((q: string) => q.trim())
    }

    logger.info('BullMQ worker started')

    // 1. Load all job classes from app/jobs
    const config = this.app.config.get<BullMQConfig>('bullmq')
    const jobsDirectory = config?.jobsDirectory || 'app/jobs'
    const jobsDir = join(fileURLToPath(this.app.appRoot), jobsDirectory)

    const files = await readdir(jobsDir)
    const jobs = await Promise.all(
      files
        .filter((f) => ['.ts', '.js'].includes(extname(f)))
        .map(async (file) => {
          const mod = await import(join(jobsDir, file))
          if (!mod.default) {
            logger.warn(`Job file ${file} has no default export and will be skipped`)
          }
          return mod.default
        })
    )

    // 2. Register a worker for each job (with concurrency)
    jobs.filter(Boolean).forEach((JobClass) => {
      const queueName = JobClass.jobName || JobClass.name
      if (this.queue?.length && !this.queue.includes(queueName)) return
      bullmq.worker(
        queueName,
        async (job) => {
          // 🔥 FIXED: Use container.make() instead of new JobClass()
          const jobInstance = await this.app.container.make(JobClass)
          return jobInstance.handle({ data: job.data, job })
        },
        { concurrency: 8 }
      )
    })

    // 3. Block process (wait forever)
    await new Promise(() => {})
  }
}
