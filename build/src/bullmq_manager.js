import { Queue, Worker, QueueEvents } from 'bullmq';
export default class BullMQManager {
    config;
    logger;
    queues = new Map();
    workers = new Map();
    queueEvents = new Map();
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
    }
    queue(name) {
        if (!this.queues.has(name)) {
            const queue = new Queue(name, {
                connection: this.config.connection,
                prefix: this.config.prefix,
                defaultJobOptions: this.config.defaultJobOptions,
            });
            this.queues.set(name, queue);
        }
        return this.queues.get(name);
    }
    worker(name, processor, options = {}) {
        if (!this.workers.has(name)) {
            const worker = new Worker(name, processor, {
                connection: this.config.connection,
                prefix: this.config.prefix,
                concurrency: options.concurrency || 1, // default 1
                ...options,
            });
            worker.on('error', (error) => {
                this.logger.error(`Worker ${name} error: ${error.message}`);
            });
            worker.on('failed', (job, error) => {
                this.logger.error(`Job ${job?.id} failed in queue ${name}: ${error.message}`);
            });
            worker.on('completed', (job) => {
                this.logger.info(`Job ${job.id} completed in queue ${name}`);
            });
            this.workers.set(name, worker);
        }
        return this.workers.get(name);
    }
    events(name) {
        if (!this.queueEvents.has(name)) {
            const queueEvents = new QueueEvents(name, {
                connection: this.config.connection,
                prefix: this.config.prefix,
            });
            this.queueEvents.set(name, queueEvents);
        }
        return this.queueEvents.get(name);
    }
    getQueues() {
        return Array.from(this.queues.values());
    }
    getWorkers() {
        return Array.from(this.workers.values());
    }
    async shutdown() {
        for (const worker of this.workers.values()) {
            await worker.close();
        }
        for (const queueEvents of this.queueEvents.values()) {
            await queueEvents.close();
        }
        for (const queue of this.queues.values()) {
            await queue.close();
        }
        this.workers.clear();
        this.queueEvents.clear();
        this.queues.clear();
    }
}
