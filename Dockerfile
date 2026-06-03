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

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace ENTIRE nginx config (not just conf.d/default.conf)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 7860

CMD ["nginx", "-g", "daemon off;"]