import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
export default class BullListen extends BaseCommand {
    static commandName: string;
    static description: string;
    static options: CommandOptions;
    run(): Promise<void>;
}
