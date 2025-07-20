import type { ApplicationService } from '@adonisjs/core/types';
export default class BullMQProvider {
    protected app: ApplicationService;
    constructor(app: ApplicationService);
    register(): void;
}
