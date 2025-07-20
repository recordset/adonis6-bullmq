import type { ApplicationService } from '@adonisjs/core/types'
import BullMQManager from '../src/bullmq_manager.js'

export default class BullMQProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(BullMQManager, async () => {
      const config = this.app.config.get('bullmq') as import('../src/types.js').BullMQConfig
      if (!config) {
        throw new Error(
          'BullMQ configuration is missing. Please ensure it is defined in your application config.'
        )
      }

      const logger = await this.app.container.make('logger')
      return new BullMQManager(config, logger)
    })
  }
}
