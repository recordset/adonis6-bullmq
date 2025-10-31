import { BaseCommand, args } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/index.js'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import type { BullMQConfig } from '../src/types.js'

export default class MakeJob extends BaseCommand {
  public static commandName = 'make:job'
  public static description = 'Generate job from template'
  static options: CommandOptions = { allowUnknownFlags: true }

  @args.string({ description: 'Name of the job class' })
  declare name: string

  async run() {
    const codemods = await this.createCodemods()
    
    // Read jobsDirectory from config
    const config = this.app.config.get<BullMQConfig>('bullmq')
    const jobsDirectory = config?.jobsDirectory || 'app/jobs'
    
    await codemods.makeUsingStub(stubsRoot, 'job/main.stub', {
      entity: this.app.generators.createEntity(this.name),
      jobsDirectory,
    })
  }
}
