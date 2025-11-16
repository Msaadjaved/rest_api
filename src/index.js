import express from "express"
import config from "./config/config.js"
import { logMiddleware } from "./middleware/logger.js"
import { validateApiKey, validateApiKeyProduction } from "./middleware/apiKey.js"
import userRoutes from "./routes/userRoutes.js"
import carRoutes from "./routes/carRoutes.js"
import { initializeDatabase } from "./config/database.js"

const app = express()

// Initialize database before starting server
await initializeDatabase()

// Global middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logMiddleware)

// Serve static frontend files from public folder
app.use(express.static('public'))

// API routes (prefixed to avoid conflicts with static files)
app.get('/api', (req, res) => {
  res.json({
    message: "Welcome to the API",
    version: "1.0.0",
    environment: config.nodeEnv,
    endpoints: {
      users: "/api/users",
      cars: "/api/cars"
    }
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  })
})

// Protected routes
app.use('/api/users', validateApiKey, userRoutes)
app.use('/api/cars', validateApiKey, carRoutes)

// 404 handler for API routes only
app.use((req, res, next) => {
  // Only handle 404 for API routes, let static files pass through
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.path} not found`
    })
  }
  next()
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(config.isDevelopment() && { stack: err.stack })
  })
})

// Start server
app.listen(config.port, () => {
  console.log(`✅ Server running on http://localhost:${config.port}`)
  console.log(`📊 Environment: ${config.nodeEnv}`)
  console.log(`🔒 API Key protection: ${config.apiKey ? 'ENABLED' : 'DISABLED'}`)
  console.log(`\nAPI Endpoints:`)
  console.log(`  GET    /api              - Welcome message (public)`)
  console.log(`  GET    /api/health       - Health check (public)`)
  console.log(`  GET    /api/users        - Get all users (protected)`)
  console.log(`  GET    /api/users/:id    - Get user by ID (protected)`)
  console.log(`  POST   /api/users        - Create new user (protected)`)
  console.log(`  PUT    /api/users/:id    - Update user (protected)`)
  console.log(`  DELETE /api/users/:id    - Delete user (protected)`)
  console.log(`  GET    /api/cars         - Get all cars (protected)`)
  console.log(`  GET    /api/cars/:id     - Get car by ID (protected)`)
  console.log(`  POST   /api/cars         - Create new car (protected)`)
  console.log(`  PUT    /api/cars/:id     - Update car (protected)`)
  console.log(`  DELETE /api/cars/:id     - Delete car (protected)`)
})

export default app