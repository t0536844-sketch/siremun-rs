# Multi-stage build for HuggingFace Spaces
# Stage 1: Build the React/Vite app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Verify build output exists
RUN ls -la /app/dist && test -f /app/dist/index.html

# Stage 2: Serve with serve (simple, reliable static server)
FROM node:20-alpine

RUN npm install -g serve@latest

# Copy built files from builder stage
COPY --from=builder /app/dist /app/dist

EXPOSE 7860

# serve with SPA fallback (-s) on port 7860 (-l)
CMD ["serve", "-s", "/app/dist", "-l", "7860"]