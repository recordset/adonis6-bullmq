import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import type { Logger } from '@adonisjs/core/logger';
import type { BullMQConfig, JobData, JobResult } from './types.js';
export default class BullMQManager {
    private config;
    private logger;
    private queues;
    private workers;
    private queueEvents;
    constructor(config: BullMQConfig, logger: Logger);
    queue<T = JobData, R = JobResult>(name: string): Queue<any, any, string, any, any, string>;
    worker<T = JobData, R = JobResult>(name: string, processor: string | ((job: Job<T, R>) => Promise<R>), options?: any): Worker<any, any, string>;
    events(name: string): QueueEvents;
    getQueues(): Queue<any, any, string, any, any, string>[];
    getWorkers(): Worker<any, any, string>[];
    shutdown(): Promise<void>;
}
