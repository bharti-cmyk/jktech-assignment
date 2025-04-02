# 🚀 NestJS API Gateway

## 📌 Project Overview
This project is an **API Gateway** built using **NestJS**, designed for handling authentication, role-based access control, document management, and ingestion control. It serves as a central entry point for microservices, managing requests and routing them appropriately.

---

## 🛠️ Tech Stack
- **Backend Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL (with TypeORM)
- **Authentication:** JWT & Passport.js
- **File Uploads:** Multer-S3
- **Caching:** Redis
- **RBAC (Role-Based Access Control):** CASL
- **Testing:** Jest & Supertest
- **API Documentation:** Swagger (OpenAPI)

---

## 📂 Project Structure
```
api-gateway/
│── src/
│   ├── auth/             # Authentication & Authorization
│   ├── database/         # Database & Redis Config
│   ├── document/         # Document Management APIs
│   ├── ingestion/        # Ingestion APIs
│   ├── global/upload/    # File Upload Configurations
│   ├── main.ts           # Application Entry Point
│   ├── app.module.ts     # Main Module
│
│── test/
│   ├── app.e2e-spec.ts   # End-to-End Tests
│
│── .env                  # Environment Variables
│── README.md             # Documentation
│── package.json          # Project Dependencies
```

---

## 🚀 Getting Started
### 1️⃣ Prerequisites
Ensure you have the following installed:
- Node.js (v20+ recommended)
- PostgreSQL
- Redis
- AWS S3 (for file uploads)

### 2️⃣ Installation
```bash
git clone https://github.com/your-repo/api-gateway.git
cd api-gateway
npm install
```

### 3️⃣ Environment Variables
Create a `.env` file in the project root and add:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
JWT_SECRET=your_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```

### 4️⃣ Run the Application
```bash
npm run start  # Start the app
npm run start:dev  # Development mode (watch mode)
```
The API Gateway will be running at: `http://localhost:3000`

---

## 🔹 API Documentation
Swagger is enabled for API documentation. You can access it at:
```
http://localhost:3000/api-docs#
```

---

## 🧪 Testing
### 1️⃣ Run Unit Tests
```bash
npm run test
```
### 2️⃣ Run E2E Tests
```bash
npm run test:e2e
```

---

## 🚀 Deployment
### Docker Setup (Optional)
Create a `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
EXPOSE 3000
```
Build and run the container:
```bash
docker build -t api-gateway .
docker run -p 3000:3000 api-gateway
```

---

## 🔥 Features
✅ **JWT Authentication** (Login, Signup, Logout)  
✅ **Role-Based Access Control (RBAC)** using CASL  
✅ **Document Management** (CRUD operations)  
✅ **File Uploads to AWS S3** using Multer  
✅ **Microservices Integration** (for ingestion control)  
✅ **API Gateway Pattern Implementation**  
✅ **Swagger API Documentation**  
✅ **Redis Caching for Optimized Performance**  

---

## 📌 License
This project is licensed under the MIT License.

---

## 🙌 Contributing
Feel free to submit a pull request or report issues.

---

## 📞 Contact
For any inquiries, reach out at `your-email@example.com`.

