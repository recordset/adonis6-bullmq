# Adonis6 BullMQ Example Usage

## 1. Installation & Setup

```bash
npm install @recordset/adonis6-bullmq bullmq
```

```bash
node ace configure @recordset/adonis6-bullmq
```

## 2. Create config/bullmq.ts

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

## 3. Create a Job

```bash
node ace make:job SendEmailJob
```

This creates `app/jobs/send_email_job.ts`:

```typescript
import { BaseJob } from '@recordset/adonis6-bullmq/job'
import type { JobContext } from '@recordset/adonis6-bullmq/types'

export default class SendEmailJob extends BaseJob {
  public static get jobName(): string {
    return 'send-email-job'
  }

  async handle(context: JobContext): Promise<any> {
    const { data } = context
    
    // Send email logic here
    console.log('Sending email to:', data.email)
    
    return { success: true, processedAt: new Date() }
  }

  async failed(job: any, error: Error): Promise<void> {
    console.error('SendEmailJob failed:', error.message)
  }
}
```

## 4. Dispatch Jobs

In your controller:

```typescript
import app from '@adonisjs/core/services/app'
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
    
    // Or schedule for later
    await queueService.scheduleOnDefault('send-email-job', {
      email: user.email,
      name: user.name,
    }, 5000) // 5 seconds delay
  }
}
```

## 5. Process Jobs

Start the queue listener:

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

## Environment Variables

Add to your `.env`:

```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
BULLMQ_KEY_PREFIX=bull
```
