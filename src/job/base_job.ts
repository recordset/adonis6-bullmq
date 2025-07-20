import type { JobContext } from '../types.js'

export class BaseJob {
  static get jobName(): string {
    return this.name
  }

  async handle(_context: JobContext): Promise<any> {
    throw new Error('handle() must be implemented in subclass')
  }

  async failed(_job: any, _error: Error): Promise<void> {
    // Optionally override in subclass
  }
}
