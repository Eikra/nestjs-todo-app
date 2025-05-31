# nestjs-todo-app# NestJS Todo API with Authentication

This project is a RESTful API for a Todo application built as part of a Backend Developer Internship project. It uses **NestJS**, **TypeScript**, **Prisma ORM** with **PostgreSQL**, and **Redis** for caching. The API includes user authentication, todo management, and follows best practices for security, performance, and code quality.

## Table of Contents
- [Project Overview](#project-overview)
- [Technical Stack](#technical-stack)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
This project implements a Todo API with user authentication, allowing users to register, log in, manage their profiles, and perform CRUD operations on todo items. It incorporates JWT-based authentication, Redis caching for performance, and comprehensive testing to ensure reliability.

## Technical Stack
- **NestJS**: Framework for building the API
- **TypeScript**: For type safety and improved developer experience
- **Prisma**: ORM for database operations with PostgreSQL
- **PostgreSQL**: Primary database
- **Redis**: In-memory caching for frequently accessed data
- **ESLint**: For code quality and consistency
- **Jest**: For unit and integration testing

## Features
- **Users Module**:
  - User registration and profile management
  - Password hashing using Argon2
  - User profile updates
- **Authentication Module**:
  - JWT-based authentication
  - Sign-up and sign-in functionality
  - Token-based authorization
- **Todo Module**:
  - CRUD operations for todo items
  - Filtering and sorting capabilities
  - Todo completion status management
- **Caching**:
  - Redis caching for todo lists
  - Cache invalidation on create, update, or delete operations
- **Security**:
  - Input validation and sanitization
  - Protection against common vulnerabilities (e.g., CSRF, XSS)
  - Rate limiting (configured but not implemented in this version)
- **Testing**:
  - Unit tests for services
  - End-to-end tests for API endpoints
  - Minimum 80% test coverage
- **Documentation**:
  - Comprehensive API documentation (see below)
  - Clear code comments and organized project structure

## Setup Instructions
### Prerequisites
- **Docker** and **Docker Compose**: For running PostgreSQL and Redis
- **Node.js**: Version 20 or higher
- **Yarn**: Version 4.9.1 (managed via Corepack)
- **Git**: For cloning the repository

### Steps
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd nestjs-todo-app
   ```

2. **Install Dependencies**:
   ```bash
   corepack enable
   corepack prepare yarn@4.9.1 --activate
   cd nestjs-app
   yarn install --immutable
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the `nestjs-app` directory based on the provided `.env.example`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/nestdb?schema=public
   REDIS_HOST=localhost
   REDIS_PORT=6379
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```
   Create a `.env.test` file for testing:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5435/nestdb?schema=public
   REDIS_HOST=localhost
   REDIS_PORT=6379
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start Services with Docker**:
   ```bash
   make start
   ```

5. **Run Database Migrations**:
   ```bash
   make migrate
   ```

6. **Start the Application**:
   - For production:
     ```bash
     make start
     ```
   - For development (with hot-reload):
     ```bash
     make start-dev
     ```

7. **Access the API**:
   The API will be available at `http://localhost:3000`.

8. **View Logs**:
   ```bash
   make logs
   ```

9. **Stop Services**:
   ```bash
   make stop_db
   ```

10. **Clean Up**:
    To remove containers and volumes:
    ```bash
    make clean_db
    ```

## API Documentation
The API follows RESTful principles with proper HTTP methods and status codes. Below are the main endpoints:

### Authentication
- **POST /auth/signup**
  - Body: `{ "email": "string", "password": "string" }`
  - Response: `201 Created` with user data (excluding password)
  - Description: Registers a new user
- **POST /auth/signin**
  - Body: `{ "email": "string", "password": "string" }`
  - Response: `200 OK` with `{ "access_token": "string" }`
  - Description: Authenticates a user and returns a JWT

### Users
- **GET /users/me**
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 OK` with user data
  - Description: Retrieves the authenticated user's profile
- **PATCH /users**
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "email": "string", "firstName": "string", "lastName": "string" }` (all optional)
  - Response: `200 OK` with updated user data
  - Description: Updates the authenticated user's profile

### Todos
- **GET /todos**
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 OK` with array of todos
  - Description: Retrieves all todos for the authenticated user
- **GET /todos/:id**
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 OK` with single todo
  - Description: Retrieves a specific todo by ID
- **POST /todos**
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "string", "description": "string" }` (description optional)
  - Response: `201 Created` with created todo
  - Description: Creates a new todo
- **PATCH /todos/:id**
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "string", "description": "string", "completed": boolean }` (all optional)
  - Response: `200 OK` with updated todo
  - Description: Updates a specific todo
- **DELETE /todos/:id**
  - Headers: `Authorization: Bearer <token>`
  - Response: `204 No Content`
  - Description: Deletes a specific todo

## Running Tests
The project includes unit and end-to-end tests with Jest and Pactum.

1. **Start the Test Database**:
   ```bash
   make test
   ```

2. **Run Tests**:
   ```bash
   cd nestjs-app
   yarn test
   ```

3. **Run End-to-End Tests**:
   ```bash
   yarn test:e2e
   ```

4. **Check Test Coverage**:
   ```bash
   yarn test:cov
   ```

## Project Structure
```
nestjs-todo-app/
├── nestjs-app/
│   ├── src/
│   │   ├── auth/
│   │   ├── prisma/
│   │   ├── todo/
│   │   ├── user/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── test/
│   │   └── app.e2e-spec.ts
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .env
│   ├── .env.test
│   └── package.json
├── Makefile
└── README.md
```

## Environment Variables
The application uses the following environment variables:
- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/nestdb?schema=public`)
- `REDIS_HOST`: Redis host (default: `localhost`)
- `REDIS_PORT`: Redis port (default: `6379`)
- `JWT_SECRET`: Secret key for JWT signing
- `PORT`: Application port (default: `3000`)

For testing, use `.env.test` with a different `DATABASE_URL` (e.g., port `5435`).

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request.

## License
This project is licensed under the MIT License.