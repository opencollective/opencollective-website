import { join } from 'path'

export const renderer = require(
  join(process.cwd(), 'frontend', 'dist', 'server.bundle.js')
).renderer

export default renderer
