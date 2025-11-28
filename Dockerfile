# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code and configuration files
COPY . .

# Build the application
RUN npm run build

# Verify build output exists
RUN ls -la dist/ && \
    test -f dist/main.js || (echo "ERROR: dist/main.js not found!" && exit 1)

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/nest-cli.json ./nest-cli.json

# Verify dist was copied correctly
RUN ls -la dist/ && \
    test -f dist/main.js || (echo "ERROR: dist/main.js not copied!" && exit 1)

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
