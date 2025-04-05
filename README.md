🧾 NestJS Microservices – API Gateway & Ingestion
This project is a production-ready NestJS microservices architecture featuring:

🛡 API Gateway for handling authentication, routing, and user access

⚙️ Ingestion Service for document ingestion processing

🗃 PostgreSQL for persistent data

⚡ Redis for caching and queue management

🚀 Dockerized Production Deployment

🔄 CI/CD with GitHub Actions for auto-deployment to a DigitalOcean droplet

📁 Project Structure
css
Copy
Edit
.
├── api-gateway/
│   ├── src/
│   ├── Dockerfile
│   └── .env.prod
├── ingestion/
│   ├── src/
│   ├── Dockerfile
│   └── .env.prod
├── docker-compose.prod.yml
├── uploads/
└── .github/workflows/deploy.yml
⚙️ Environment Variables
Create .env.prod files in both api-gateway/ and ingestion/.

Example .env.prod
env
Copy
Edit
# JWT
JWT_SECRET=super_secret_key

# Upload
UPLOAD_PATH=./uploads
UPLOAD_MAX_FILE_SIZE=10485760 # 10MB

# Database
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=root
DATABASE_NAME=legacy_service

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
🐳 Docker Compose (Production)
Use docker-compose.prod.yml to run all services in production:

docker compose -f docker-compose.prod.yml up --build -d
Ports
Service	     Port on Host	   Port in Container
API Gateway	  4001	          3000
Ingestion	    4002	          3000
PostgreSQL	  5432	          5432
Redis	        6379	          6379
