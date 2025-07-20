import { test } from '@japa/runner'
import BullMQManager from '../src/bullmq_manager.js'

test.group('BullMQManager', () => {
  test('can create a queue and add a job', async ({ assert }) => {
    const config = { host: 'localhost', port: 6379 }
    const logger = { info: () => {}, error: () => {} } as any
    const manager = new BullMQManager(config, logger)
    const queue = manager.queue('test')
    await queue.add('test-job', { foo: 'bar' })
    assert.isTrue(queue.name === 'test')
    await manager.shutdown()
  })
})
