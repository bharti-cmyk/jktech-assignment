# API Gateway

The `api-gateway` is the central entry point for all client requests in the system. It handles routing, authentication, authorization, and communication with other microservices. It uses a modular architecture and integrates with services like Redis, PostgreSQL, and other microservices.

---

## Features

- Centralized routing for all microservices.
- JWT-based authentication and role-based access control.
- Communication with other microservices via Redis.
- File upload and ingestion management.
- API documentation using Swagger.

---

## Prerequisites

Ensure the following are installed on your system:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Docker](https://www.docker.com/)
- [Redis](https://redis.io/)
- [PostgreSQL](https://www.postgresql.org/)

---

## Installation

### Install Dependencies
Run the following command to install the required dependencies:
```bash
npm install