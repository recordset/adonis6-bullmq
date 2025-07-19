import type { ApplicationService } from '@adonisjs/core/types'
import BullMQManager from '../src/bullmq_manager.js'

export default class BullMQProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    // Register the BullMQ manager as a singleton
    this.app.container.singleton(BullMQManager, async () => {
      const config = this.app.config.get('bullmq') as any
      const logger = await this.app.container.make('logger')
      
      return new BullMQManager(config, logger)
    })
  }

  async boot() {
    // All bindings are ready
  }

  async start() {
    // App is starting
  }

  async ready() {
    // App is ready
  }

  async shutdown() {
    try {
      const bullmq = await this.app.container.make(BullMQManager)
      if (bullmq && typeof bullmq.shutdown === 'function') {
        await bullmq.shutdown()
      }
    } catch (error) {
      // Ignore errors if service not initialized
    }
  }
}
