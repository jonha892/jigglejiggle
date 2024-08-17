# Compile react app
FROM node:20-slim as build_frontend

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY frontend/package.json frontend/pnpm-lock.yaml ./
COPY frontend/public ./public
COPY frontend/src ./src
COPY frontend/tsconfig.json ./
COPY frontend/tsconfig.node.json ./
COPY frontend/index.html ./
COPY frontend/.env .env
COPY frontend/.env.production .env.production
COPY frontend/vite.config.ts ./


RUN pnpm install

RUN pnpm run build

# Backend Dockerfile
FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
  build-essential \
  libpq-dev \
  gcc \
  && apt-get clean

# Set the working directory in the container
WORKDIR /app

# Copy requirements.txt and install dependencies
COPY backend/requirements.txt ./
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY backend/main.py main.py
COPY backend/jigglejiggle jigglejiggle
COPY backend/.env .env

# Copy the compiled frontend code
COPY --from=build_frontend /app/dist /app/public

# Set the command to run the application
CMD ["fastapi", "run", "main.py"]