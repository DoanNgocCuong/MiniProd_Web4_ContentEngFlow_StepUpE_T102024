# Use multi-stage build
FROM node:18-alpine AS builder

# Add build dependencies
RUN apk add --no-cache python3 make g++

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

# Add runtime dependencies only
RUN apk add --no-cache curl

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# Set Node environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Use node directly instead of npm for better performance
CMD ["node", "src/index.js"]