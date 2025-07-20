import { BaseJob } from '@recordset/adonis6-bullmq/job'
import type { JobContext } from '@recordset/adonis6-bullmq/types'

export default class ExampleJob extends BaseJob {
  public static get jobName() {
    return 'example-job'
  }

  async handle(context: JobContext) {
    const { data } = context
    console.log('Processing ExampleJob with data:', data)
    return { success: true, processedAt: new Date() }
  }

  async failed(job: any, error: Error) {
    console.error('ExampleJob failed:', error.message)
  }
}
