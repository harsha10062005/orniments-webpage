import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import express from 'express'
import { apiRouter } from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()) ?? '*',
      credentials: true,
    }),
  )

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
    }),
  )

  app.use(express.json({ limit: '5mb' }))
  app.use(express.urlencoded({ extended: true }))

  app.get('/api/health', (req, res) => {
    res.json({ ok: true })
  })

  app.use('/api', apiRouter)

  app.use(errorHandler)

  return app
}

