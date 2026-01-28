# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN npm install -g bun && bun install

# Copy source code
COPY . .

# Build arguments for build-time environment variables
ARG NEXT_PUBLIC_OTP_API_URL
ARG NEXT_PUBLIC_OTP_API_KEY
ARG NEXT_PUBLIC_OTP_SECRET_KEY
ARG NEXT_PUBLIC_OTP_SENDER_NAME

# Set environment variables for build
ENV NEXT_PUBLIC_OTP_API_URL=$NEXT_PUBLIC_OTP_API_URL
ENV NEXT_PUBLIC_OTP_API_KEY=$NEXT_PUBLIC_OTP_API_KEY
ENV NEXT_PUBLIC_OTP_SECRET_KEY=$NEXT_PUBLIC_OTP_SECRET_KEY
ENV NEXT_PUBLIC_OTP_SENDER_NAME=$NEXT_PUBLIC_OTP_SENDER_NAME

# Build the application
RUN bun run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Runtime environment variables
ENV NEXT_PUBLIC_OTP_API_URL=$NEXT_PUBLIC_OTP_API_URL
ENV NEXT_PUBLIC_OTP_API_KEY=$NEXT_PUBLIC_OTP_API_KEY
ENV NEXT_PUBLIC_OTP_SECRET_KEY=$NEXT_PUBLIC_OTP_SECRET_KEY
ENV NEXT_PUBLIC_OTP_SENDER_NAME=$NEXT_PUBLIC_OTP_SENDER_NAME

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose port
EXPOSE 3000

# Set user to non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

# Start the application
CMD ["node", "server.js"]
