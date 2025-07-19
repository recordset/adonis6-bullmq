import { getDirname } from '@adonisjs/core/helpers'
import { fileURLToPath } from 'node:url'

export const stubsRoot = getDirname(import.meta.url)
