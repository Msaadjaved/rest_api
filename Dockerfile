# Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# IMPORTANT: Create data directory for SQLite with proper permissions
RUN mkdir -p /usr/src/app/data && \
    chown -R node:node /usr/src/app/data && \
    chmod 755 /usr/src/app/data

# Switch to non-root user
USER node

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"]