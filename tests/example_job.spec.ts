import { test } from '@japa/runner'
import ExampleJob from '../app/jobs/example_job.js'

test.group('ExampleJob', () => {
  test('can handle job data', async ({ assert }) => {
    const jobContext = { data: { foo: 'bar' }, job: { id: 1 } }
    const job = new ExampleJob()
    const result = await job.handle(jobContext)
    assert.isTrue(result.success)
  })
})
