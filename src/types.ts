/**
 * BullMQ configuration options
 */
export interface BullMQConfig {
  /**
   * Redis connection options
   */
  connection: {
    host: string
    port: number
    password?: string
    db?: number
  }

  /**
   * Key prefix for all BullMQ keys in Redis
   */
  prefix?: string
  keyPrefix?: string

  /**
   * Default queue options
   */
  defaultJobOptions?: {
    removeOnComplete?: number | boolean
    removeOnFail?: number | boolean
    delay?: number
    priority?: number
    attempts?: number
    backoff?: {
      type: string
      delay?: number
    }
  }
}

/**
 * Job data interface
 */
export interface JobData {
  [key: string]: any
}

/**
 * Job result interface
 */
export interface JobResult {
  [key: string]: any
}

/**
 * Job context interface
 */
export interface JobContext {
  data: JobData
  job: any
  token?: string
}
