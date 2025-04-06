# Ingestion Microservice

The `ingestion` microservice is responsible for managing ingestion records, including creating, retrieving, and processing ingestion data. It communicates with other services via a message broker (e.g., Redis) and exposes endpoints for internal and external use.

---

## Features

- Create ingestion records.
- Retrieve ingestion records by ID.
- Event-driven architecture using Redis as the transport layer.
- Integration with other microservices.

---

## Prerequisites

Ensure the following are installed on your system:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Docker](https://www.docker.com/)
- [Redis](https://redis.io/)

---
Install dependencies:
npm install

Add .env file
JWT_SECRET=jktech
API_GATEWAY_PORT=3000
DATABASE_HOST=postgres_container
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=root
DATABASE_NAME=legacy_service
REDIS_HOST=redis
REDIS_PORT=6379


docker-compose up -d --build
Running this command will start all the services

Using Node.js
Start the service:

npm run start