import type { JobContext } from '../types.js';
export declare class BaseJob {
    static get jobName(): string;
    handle(_context: JobContext): Promise<any>;
    failed(_job: any, _error: Error): Promise<void>;
}
