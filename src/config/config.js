// config.js
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// For Render: Use /data directory which is writable
const isProduction = process.env.NODE_ENV === 'production'
const databasePath = isProduction 
  ? '/usr/src/app/data/database.sqlite'  // Render writable path
  : path.join(__dirname, '../../database.sqlite')  // Local path

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || databasePath,
  apiKey: process.env.API_KEY || 'test-api-my-key-2026',
  jwtSecret: process.env.JWT_SECRET || '2O9CSwNH/k8P/WMyACwjXYU7oKMx0afqXHBC1DnaUn0=',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Helper methods
  isDevelopment: () => config.nodeEnv === 'development',
  isProduction: () => config.nodeEnv === 'production'
}

console.log('📋 Configuration loaded:')
console.log(`   PORT: ${config.port}`)
console.log(`   NODE_ENV: ${config.nodeEnv}`)
console.log(`   DATABASE_URL: ${config.databaseUrl}`)
console.log(`   API_KEY: ${config.apiKey ? '***' : 'NOT SET'}`)

export default config