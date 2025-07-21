# Example: Using @recordset/adonis6-bullmq

## 1. Create a job class

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

## 2. Add a job from anywhere in your app

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

// Listen for job events (QueueEvents)
const queueEvents = bullMQManager.events('EmailJob')

queueEvents.on('completed', ({ jobId }) => {
  console.log('Email job completed:', jobId)
})

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error('Email job failed:', jobId, failedReason)
})
```

## 3. Start the worker

```sh
node ace bull:listen
```

You should see output when the job is processed:

```
Sending email to user@example.com
```

---

See [README.md](./README.md) and [SETUP.md](./SETUP.md) for more details.
