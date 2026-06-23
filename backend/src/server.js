import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import { createApp } from './app.js'

dotenv.config()

async function main() {
  await connectDB()
  const app = createApp()

  const port = process.env.PORT || 4000
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on :${port}`)
  })
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Server startup error:', err)
  process.exit(1)
})

