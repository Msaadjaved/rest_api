import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import config from './config.js'
import fs from 'fs'  // NEW: Import fs to check/create directory

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Use DATABASE_URL from config
let dbPath
if (path.isAbsolute(config.databaseUrl)) {
  dbPath = config.databaseUrl
} else {
  dbPath = path.join(__dirname, '../../', config.databaseUrl)
}

// NEW: Ensure the directory exists
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  console.log(`📁 Creating database directory: ${dbDir}`)
  fs.mkdirSync(dbDir, { recursive: true, mode: 0o755 })
}

console.log(`📊 Database path: ${dbPath}`)

// Create/connect to database
const db = new Database(dbPath)
db.pragma('foreign_keys = ON')

// Initialize database tables
export const initializeDatabase = async () => {
  console.log('🔧 Initializing database...')

  // Import models dynamically
  const User = (await import('../models/User.js')).default
  const Car = (await import('../models/car.js')).default

  // Create tables
  User.createTable()
  Car.createTable()

  // Seed in development
  if (config.isDevelopment()) {
    User.seed()
    Car.seed()
  }

  console.log('✅ Database initialization complete')
}

export default db