# Setup Instructions for @recordset/adonis6-bullmq

## 1. Install the package

```bash
npm install @recordset/adonis6-bullmq bullmq
```

## 2. Register the provider in adonisrc.ts

Add the provider to your `adonisrc.ts` file:

```typescript
import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  // ... other config
  
  providers: [
    // ... other providers
    () => import('@recordset/adonis6-bullmq/bullmq_provider'),
  ],
  
  commands: [
    // ... other commands
    () => import('@recordset/adonis6-bullmq/commands/make_job'),
    () => import('@recordset/adonis6-bullmq/commands/bull_listen'),
  ],
})
```

## 3. Create config/bullmq.ts

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

## 4. Add environment variables to .env

```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
BULLMQ_KEY_PREFIX=bull
```

## 5. Create a job

```bash
node ace make:job SendEmailJob
```

## 6. Start the queue worker

```bash
node ace bull:listen
```

## 7. Dispatch jobs in your controllers

```typescript
import app from '@adonisjs/core/services/app'
import QueueService from '@recordset/adonis6-bullmq/services/queue_service'
import BullMQManager from '@recordset/adonis6-bullmq/src/bullmq_manager'

export default class UserController {
  async register() {
    // ... registration logic
    
    const bullmq = await app.container.make(BullMQManager)
    const queueService = new QueueService(bullmq)
    
    await queueService.dispatchToDefault('send-email-job', {
      email: user.email,
      name: user.name,
    })
  }
}
```

That's it! Your BullMQ integration is ready to use.
