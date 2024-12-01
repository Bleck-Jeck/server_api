FROM node:20-alpine AS base

# Create app directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm i -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm i --frozen-lockfile --prefer-offline

# Copy source code
COPY . .

# Copy environment variables file
COPY .env.production .env

# Build the project
RUN pnpm build

# Set NODE_ENV to production
ENV NODE_ENV production

# Expose the port defined in the .env file
EXPOSE 8080

# Start the app
CMD [ "node", "dist/index.js" ]

# Set user to non-root (optional)
USER node
