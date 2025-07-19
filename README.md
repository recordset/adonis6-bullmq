# Adonis6 BullMQ

A BullMQ provider for AdonisJS 6 that provides a simple and efficient way to handle background jobs using Redis.

## Features

- 🚀 Easy job creation with `make:job` command
- 🎯 Queue listener with `bull:listen` command
- 📦 Clean job organization
- ⚙️ Configurable options
- 🔄 Graceful shutdown handling
- 📊 Queue monitoring and management

## Installation

```bash
npm install @recordset/adonis6-bullmq bullmq
```

## Setup

1. Configure the package in your AdonisJS 6 project:

```bash
node ace configure @recordset/adonis6-bullmq
```

2. Add environment variables to your `.env` file:

```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
BULLMQ_KEY_PREFIX=bull
```

3. Create the config file `config/bullmq.ts`:

```typescript
import { defineConfig } from '@recordset/adonis6-bullmq'
import env from '#start/env'

export default defineConfig({
  host: env.get('REDIS_HOST', '127.0.0.1'),
  port: env.get('REDIS_PORT', 6379),
  password: env.get('REDIS_PASSWORD', ''),
  db: env.get('REDIS_DB', 0),
  keyPrefix: env.get('BULLMQ_KEY_PREFIX', 'bull'),
  
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
})
```

## Usage

### Creating Jobs

Create a new job using the make command:

```bash
node ace make:job SendEmailJob
```

This will create a job class in `app/jobs/send_email_job.ts`:

```typescript
import { BaseJob } from '@recordset/adonis6-bullmq/job'
import type { JobContext } from '@recordset/adonis6-bullmq/types'

export default class SendEmailJob extends BaseJob {
  public static get jobName(): string {
    return 'send-email-job'
  }

  async handle(context: JobContext): Promise<any> {
    const { data } = context
    
    // Your job logic here
    console.log('Sending email to:', data.email)
    
    return { success: true, processedAt: new Date() }
  }

  async failed(job: any, error: Error): Promise<void> {
    console.error('SendEmailJob failed:', error.message)
  }

  get jobOptions() {
    return {
      removeOnComplete: 10,
      removeOnFail: 5,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    }
  }
}
```

### Dispatching Jobs

In your controller or service:

```typescript
import app from '@adonisjs/core/services/app'

export default class UserController {
  async register() {
    // ... user registration logic
    
    // Dispatch email job
    const bullmq = await app.container.make('recordset/bullmq')
    const queue = bullmq.queue('default')
    
    await queue.add('send-email-job', {
      email: user.email,
      name: user.name,
      __jobType: 'send-email-job',
    })
  }
}
```

Or use the QueueService for easier dispatching:

```typescript
import QueueService from '@recordset/adonis6-bullmq/services/queue_service'

export default class UserController {
  async register() {
    // ... user registration logic
    
    const bullmq = await app.container.make('recordset/bullmq')
    const queueService = new QueueService(bullmq)
    
    // Dispatch immediately
    await queueService.dispatchToDefault('send-email-job', {
      email: user.email,
      name: user.name,
    })
    
    // Or schedule for later (delay in milliseconds)
    await queueService.scheduleOnDefault('send-email-job', {
      email: user.email,
      name: user.name,
    }, 5000) // 5 seconds delay
  }
}
```

### Processing Jobs

Start the queue listener to process jobs:

```bash
# Listen to default queue
node ace bull:listen

# Listen to specific queue
node ace bull:listen email-queue

# Listen to multiple queues
node ace bull:listen --queues=email-queue,notification-queue

# Set concurrency
node ace bull:listen --concurrency=5
```

### Queue Management

```typescript
import app from '@adonisjs/core/services/app'
import QueueService from '@recordset/adonis6-bullmq/services/queue_service'

const bullmq = await app.container.make('recordset/bullmq')
const queueService = new QueueService(bullmq)

// Get queue statistics
const stats = await queueService.getQueueStats('default')
console.log(stats) // { waiting: 5, active: 2, completed: 100, failed: 3, delayed: 1 }

// Clean completed jobs
await queueService.cleanQueue('default', 0, 100, 'completed')

// Pause/Resume queue
await queueService.pauseQueue('default')
await queueService.resumeQueue('default')
```

## Job Options

You can customize job behavior by overriding the `jobOptions` getter:

```typescript
get jobOptions() {
  return {
    removeOnComplete: 50,      // Keep last 50 completed jobs
    removeOnFail: 10,          // Keep last 10 failed jobs
    attempts: 5,               // Retry up to 5 times
    backoff: {
      type: 'exponential',     // or 'fixed'
      delay: 3000,             // Base delay in milliseconds
    },
    delay: 5000,               // Delay before first execution
    priority: 10,              // Job priority (higher = more priority)
  }
}
```

## Error Handling

Handle job failures by implementing the `failed` method:

```typescript
async failed(job: any, error: Error): Promise<void> {
  // Log the error
  console.error(`Job ${job.id} failed:`, error.message)
  
  // Send notification to admin
  // Store error in database
  // etc.
}
```

## Development

For development, you can run the queue listener in watch mode:

```bash
node ace bull:listen --watch
```

## License

MIT License
