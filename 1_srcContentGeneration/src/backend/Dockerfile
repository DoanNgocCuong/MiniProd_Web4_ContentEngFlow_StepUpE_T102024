# Use multi-stage build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first to leverage cache
COPY package*.json ./

# Install dependencies with cache and clean npm cache
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY . .

# Production stage with minimal image
FROM node:18-alpine

WORKDIR /app

# Copy all files from builder
COPY --from=builder /app/. ./

# Set Node environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Use node directly instead of npm for better performance
CMD ["node", "src/server.js"]