import type { ApplicationService } from '@adonisjs/core/types'
import type { BullMQConfig } from './src/types.js'

/**
 * Configure BullMQ provider
 */
export async function configure(app: ApplicationService) {
  console.log('🚀 Configuring BullMQ for AdonisJS 6...')
  
  // Instructions for manual setup
  console.log(`
📋 Manual Setup Required:

1. Add the provider to your adonisrc.ts providers array:
   () => import('@recordset/adonis6-bullmq/bullmq_provider')

2. Add commands to your adonisrc.ts commands array:
   () => import('@recordset/adonis6-bullmq/commands/make_job')
   () => import('@recordset/adonis6-bullmq/commands/bull_listen')

3. Create config/bullmq.ts with your Redis configuration

4. Add Redis environment variables to your .env file

See SETUP.md for detailed instructions.
`)
  
  console.log('✅ BullMQ configuration completed!')
}

/**
 * Stub configure function for publish config commands
 */
export async function configProvider(app: ApplicationService, config: BullMQConfig) {
  app.config.set('bullmq', config)
}
