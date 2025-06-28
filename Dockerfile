# 🧙‍♂️ CodeWizard Docker Configuration
# Multi-stage build for optimized production deployment

# Use Node.js 18 LTS Alpine for smaller image size and security
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
# This allows npm install to be cached if dependencies haven't changed
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install Node.js dependencies
# Install root dependencies (if any)
RUN npm install --only=production

# Install backend dependencies
RUN cd backend && npm install --only=production

# Copy application source code
# This is done after npm install for better caching
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S codewizard -u 1001

# Change ownership of app directory
RUN chown -R codewizard:nodejs /app
USER codewizard

# Expose port (Railway will override this with $PORT)
EXPOSE 3001

# Health check for container monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the backend server
CMD ["sh", "-c", "cd backend && npm start"]
