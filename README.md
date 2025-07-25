# @recordset/adonis6-bullmq

BullMQ provider for AdonisJS 6. Effortless background jobs and queue processing for modern AdonisJS apps.

## Features

- BullMQ integration (v5+)
- AdonisJS 6 provider, DI, and ace commands
- Dynamic job auto-loading from `app/jobs`
- Concurrency, retries, and job options
- TypeScript-first, ESM-ready

## Adonis6 BullMQ Setup

1. Install dependencies:
   ```bash
   npm install @recordset/adonis6-bullmq bullmq
   ```
2. Configure BullMQ:
   ```bash
   node ace configure @recordset/adonis6-bullmq
   ```
3. Edit `config/bullmq.ts` as needed.
4. Generate jobs with:
   ```bash
   node ace make:job MyJob
   ```
5. Start the worker:
   ```bash
   node ace bull:listen
   ```

## Create a job class

`app/jobs/email_job.ts`:

```typescript
import { BaseJob } from '@recordset/adonis6-bullmq/job'
export default class EmailJob extends BaseJob {
  static get jobName() {
    return 'MyJob'
  }

  async handle(context: JobContext): Promise<any> {
    const { data, job } = context
    // job.name
    console.log('Job name:', job.name)
    // Send email logic
    console.log('Sending email to', data.email)
  }
}
```

## Add a job from anywhere in your app

```typescript
import bullMQManager from '#services/bullmq_manager'
const emailQueue = bullMQManager.queue('EmailJob')

// Add job normally
await emailQueue.add('email_job', { email: 'user@example.com' })

// Add job with delay (run after 10 seconds)
await emailQueue.add('email_job', { email: 'user2@example.com' }, { delay: 10000 })

// Add job with repeat (run every day at 8:00 AM)
await emailQueue.add('email_job', { email: 'user3@example.com' }, { repeat: { cron: '0 8 * * *' } })

// Add job with custom attempts and backoff
await emailQueue.add(
  'email_job',
  { email: 'user4@example.com' },
  { attempts: 5, backoff: { type: 'exponential', delay: 5000 } }
)
```

## Listen for job events

```typescript
// Listen for job events (QueueEvents)
import bullMQManager from '#services/bullmq_manager'
const queueEvents = bullMQManager.events('EmailJob')

queueEvents.on('completed', ({ jobId }) => {
  console.log('Email job completed:', jobId)
})

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error('Email job failed:', jobId, failedReason)
})
```
