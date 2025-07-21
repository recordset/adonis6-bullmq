/*
|--------------------------------------------------------------------------
| Configure hook
|--------------------------------------------------------------------------
|
| The configure hook is called when someone runs "node ace configure <package>"
| command. You are free to perform any operations inside this function to
| configure the package.
|
| To make things easier, you have access to the underlying "ConfigureCommand"
| instance and you can use codemods to modify the source files.
|
*/

import ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  /**
   * Publish config file
   * This will create a new file at `config/bullmq.ts` with the
   */
  await codemods.makeUsingStub(stubsRoot, 'stubs/config/bullmq.stub', {})

  /**
   * Generate BullMQManager service
   * This service will be used to manage BullMQ queues and workers.
   */
  await codemods.makeUsingStub(stubsRoot, 'stubs/service/bullmq_manager.stub', {})

  /**
   * Register provider
   */
  await codemods.updateRcFile((rcFile: any) => {
    rcFile.addProvider('@recordset/adonis6-bullmq/bullmq_provider')
    rcFile.addCommand('@recordset/adonis6-bullmq/commands')
  })
}
