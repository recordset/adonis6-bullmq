import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import BullMQManager from '../src/bullmq_manager.js'
import { readdir } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

export default class BullListen extends BaseCommand {
  public static commandName = 'bull:listen'
  public static description = 'Listen to Bull queues and process jobs'
  static options: CommandOptions = { startApp: true, staysAlive: true }

  async run() {
    const logger = await this.app.container.make('logger')
    const bullmq = await this.app.container.make(BullMQManager)

    logger.info('BullMQ worker started')

    // 1. Load all job classes from app/jobs
    const jobsDir = join(fileURLToPath(this.app.appRoot), 'app/jobs')
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
      bullmq.worker(
        queueName,
        async (job) => {
          const jobInstance = new JobClass()
          return jobInstance.handle({ data: job.data, job })
        },
        { concurrency: 8 }
      )
    })

    // 3. Block process (wait forever)
    await new Promise(() => {})
  }
}
